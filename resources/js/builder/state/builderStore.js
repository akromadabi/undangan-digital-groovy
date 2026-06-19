import { create } from 'zustand';
import { temporal } from 'zundo';
import { nanoid } from 'nanoid';
import { migrateSchema } from '../core/migrateSchema';
import { createEmptyDocument } from '../core/schema';

// Helper to deep clone objects
const clone = (obj) => JSON.parse(JSON.stringify(obj));

// Helper to find a node and its parent list in the tree
export function findNodeAndParent(content, id) {
    for (let i = 0; i < content.length; i++) {
        const section = content[i];
        if (section.id === id) {
            return { node: section, parent: content, index: i, type: 'section' };
        }
        for (let j = 0; j < section.columns.length; j++) {
            const column = section.columns[j];
            if (column.id === id) {
                return { node: column, parent: section.columns, index: j, type: 'column' };
            }
            for (let k = 0; k < column.widgets.length; k++) {
                const widget = column.widgets[k];
                if (widget.id === id) {
                    return { node: widget, parent: column.widgets, index: k, type: 'widget' };
                }
            }
        }
    }
    return null;
}

// Generate default empty column
export const createColumn = (width = '100%') => ({
    id: `col-${nanoid(8)}`,
    type: 'column',
    settings: {
        width,
        padding: { top: '10', bottom: '10', left: '10', right: '10' }
    },
    widgets: [],
    advanced: {}
});

// Generate default empty section
export const createSection = () => ({
    id: `sec-${nanoid(8)}`,
    type: 'section',
    settings: {
        padding: { top: '30', bottom: '30', left: '20', right: '20' },
        backgroundColor: '#ffffff'
    },
    columns: [createColumn('100%')],
    advanced: {}
});

// Create base store logic
const storeCreator = (set, get) => ({
    document: createEmptyDocument(),
    selectedId: null,
    activeBreakpoint: 'desktop',
    isSaving: false,
    lastSaved: null,

    // Document loader
    setDocument: (doc) => {
        const migrated = migrateSchema(doc);
        set({ document: migrated, selectedId: null });
    },

    // UI state actions
    setSelectedId: (id) => set({ selectedId: id }),
    setActiveBreakpoint: (bp) => set({ activeBreakpoint: bp }),
    setIsSaving: (saving) => set({ isSaving: saving }),
    setLastSaved: (time) => set({ lastSaved: time }),

    // Global settings actions
    updateGlobalSettings: (key, value) => {
        set((state) => {
            const document = clone(state.document);
            if (key.includes('.')) {
                const parts = key.split('.');
                let current = document.globalSettings;
                for (let i = 0; i < parts.length - 1; i++) {
                    current = current[parts[i]];
                }
                current[parts[parts.length - 1]] = value;
            } else {
                document.globalSettings[key] = value;
            }
            return { document };
        });
    },

    // Node operations
    addSection: (index) => {
        set((state) => {
            const document = clone(state.document);
            const newSec = createSection();
            if (typeof index === 'number') {
                document.content.splice(index, 0, newSec);
            } else {
                document.content.push(newSec);
            }
            return { document, selectedId: newSec.id };
        });
    },

    addColumn: (sectionId, width = '50%') => {
        set((state) => {
            const document = clone(state.document);
            const target = findNodeAndParent(document.content, sectionId);
            if (target && target.node.type === 'section') {
                const newCol = createColumn(width);
                target.node.columns.push(newCol);
            }
            return { document };
        });
    },

    addWidget: (columnId, widgetType, index) => {
        let newWidgetId;
        set((state) => {
            const document = clone(state.document);
            const target = findNodeAndParent(document.content, columnId);
            if (target && target.node.type === 'column') {
                newWidgetId = `wid-${nanoid(8)}`;
                const newWidget = {
                    id: newWidgetId,
                    type: widgetType,
                    settings: {},
                    advanced: {}
                };
                if (typeof index === 'number') {
                    target.node.widgets.splice(index, 0, newWidget);
                } else {
                    target.node.widgets.push(newWidget);
                }
            }
            return { document, selectedId: newWidgetId || state.selectedId };
        });
    },

    updateNodeSettings: (id, newSettings) => {
        set((state) => {
            const document = clone(state.document);
            const target = findNodeAndParent(document.content, id);
            if (target) {
                target.node.settings = {
                    ...target.node.settings,
                    ...newSettings
                };
            }
            return { document };
        });
    },

    updateNodeAdvanced: (id, newAdvanced) => {
        set((state) => {
            const document = clone(state.document);
            const target = findNodeAndParent(document.content, id);
            if (target) {
                target.node.advanced = {
                    ...target.node.advanced,
                    ...newAdvanced
                };
            }
            return { document };
        });
    },

    deleteNode: (id) => {
        set((state) => {
            const document = clone(state.document);
            const target = findNodeAndParent(document.content, id);
            if (target) {
                target.parent.splice(target.index, 1);
            }
            return {
                document,
                selectedId: state.selectedId === id ? null : state.selectedId
            };
        });
    },

    duplicateNode: (id) => {
        set((state) => {
            const document = clone(state.document);
            const target = findNodeAndParent(document.content, id);
            if (!target) return {};

            const duplicated = clone(target.node);
            
            // Recursive helper to assign brand new nanoids to duplicated items
            const reassignIds = (node) => {
                const oldPrefix = node.id.split('-')[0];
                node.id = `${oldPrefix}-${nanoid(8)}`;
                if (node.columns) node.columns.forEach(reassignIds);
                if (node.widgets) node.widgets.forEach(reassignIds);
            };

            reassignIds(duplicated);
            target.parent.splice(target.index + 1, 0, duplicated);

            return { document, selectedId: duplicated.id };
        });
    },

    // Move nodes for drag and drop reordering
    moveNode: (activeId, overId, dropPosition = 'after') => {
        set((state) => {
            const document = clone(state.document);
            const activeInfo = findNodeAndParent(document.content, activeId);
            const overInfo = findNodeAndParent(document.content, overId);

            if (!activeInfo || !overInfo) return {};

            // Ensure we are moving elements of similar depth, or moving widgets into columns
            const activeNode = activeInfo.node;

            // Remove from original place
            activeInfo.parent.splice(activeInfo.index, 1);

            // Re-fetch overInfo because parent indices might have shifted
            const refreshedOverInfo = findNodeAndParent(document.content, overId);
            if (!refreshedOverInfo) return {};

            const targetParent = refreshedOverInfo.parent;
            let insertIndex = refreshedOverInfo.index;

            if (dropPosition === 'after') {
                insertIndex += 1;
            }

            // Insert into new place
            targetParent.splice(insertIndex, 0, activeNode);

            return { document };
        });
    },

    // Move widget into a specific column directly
    moveWidgetToColumn: (widgetId, targetColumnId, insertIndex) => {
        set((state) => {
            const document = clone(state.document);
            const widgetInfo = findNodeAndParent(document.content, widgetId);
            const columnInfo = findNodeAndParent(document.content, targetColumnId);

            if (!widgetInfo || !columnInfo || widgetInfo.type !== 'widget' || columnInfo.type !== 'column') {
                return {};
            }

            // Remove from old column
            widgetInfo.parent.splice(widgetInfo.index, 1);

            // Insert into new column
            if (typeof insertIndex === 'number') {
                columnInfo.node.widgets.splice(insertIndex, 0, widgetInfo.node);
            } else {
                columnInfo.node.widgets.push(widgetInfo.node);
            }

            return { document };
        });
    }
});

// Wrap the store with temporal (zundo) middleware to support undo/redo
export const useBuilderStore = create(
    temporal(storeCreator, {
        limit: 50, // Keep 50 steps of history
        partialize: (state) => {
            // Only track document changes in history
            return { document: state.document };
        }
    })
);
