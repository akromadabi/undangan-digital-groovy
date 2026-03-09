/*
 Navicat Premium Dump SQL

 Source Server         : AKROM ADABI
 Source Server Type    : MySQL
 Source Server Version : 80030 (8.0.30)
 Source Host           : localhost:3306
 Source Schema         : undangan_digital

 Target Server Type    : MySQL
 Target Server Version : 80030 (8.0.30)
 File Encoding         : 65001

 Date: 10/03/2026 04:50:30
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for bank_accounts
-- ----------------------------
DROP TABLE IF EXISTS `bank_accounts`;
CREATE TABLE `bank_accounts`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `invitation_id` bigint UNSIGNED NOT NULL,
  `bank_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'BCA, Mandiri, GoPay, OVO, Dana',
  `account_name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `bank_logo` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `bank_accounts_invitation_id_foreign`(`invitation_id` ASC) USING BTREE,
  CONSTRAINT `bank_accounts_invitation_id_foreign` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of bank_accounts
-- ----------------------------
INSERT INTO `bank_accounts` VALUES (3, 1, 'Bank BNI', 'Mira Rahayu', '0987654321', '/themes/adat-jawa/demo/bni.png', 1, '2026-03-08 16:39:17', '2026-03-08 16:39:17');
INSERT INTO `bank_accounts` VALUES (4, 1, 'Bank Mandiri', 'Randi Wijaya', '1234567890', NULL, 2, '2026-03-08 16:39:17', '2026-03-08 16:39:17');

-- ----------------------------
-- Table structure for bride_grooms
-- ----------------------------
DROP TABLE IF EXISTS `bride_grooms`;
CREATE TABLE `bride_grooms`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `invitation_id` bigint UNSIGNED NOT NULL,
  `order_number` tinyint NOT NULL COMMENT '1=mempelai 1, 2=mempelai 2',
  `full_name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nickname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `father_name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `mother_name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `gender` enum('pria','wanita') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `photo` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `bio` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `instagram` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `tiktok` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `twitter` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `facebook` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `child_order` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Putra/Putri ke-berapa',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `bride_grooms_invitation_id_foreign`(`invitation_id` ASC) USING BTREE,
  CONSTRAINT `bride_grooms_invitation_id_foreign` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of bride_grooms
-- ----------------------------
INSERT INTO `bride_grooms` VALUES (3, 2, 1, 'Sari Puspita', 'Sari', 'Pak Hendra', 'Bu Yanti', 'wanita', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-08 15:24:48', '2026-03-08 15:24:48');
INSERT INTO `bride_grooms` VALUES (4, 2, 2, 'Andi Setiawan', 'Andi', 'Pak Dedi', 'Bu Rina', 'pria', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-08 15:24:48', '2026-03-08 15:24:48');
INSERT INTO `bride_grooms` VALUES (5, 1, 1, 'Mira Rahayu', 'Mira', 'H. Ahmad Suryanto', 'Hj. Siti Nurhaliza', 'wanita', '/themes/adat-jawa/demo/bride.jpg', 'Putri bungsu yang tumbuh di lingkungan penuh kasih sayang', 'mirarahayu', NULL, NULL, NULL, '3', '2026-03-08 16:39:17', '2026-03-08 16:39:17');
INSERT INTO `bride_grooms` VALUES (6, 1, 2, 'Randi Wijaya', 'Randi', 'H. Bambang Wijaya', 'Hj. Dewi Lestari', 'pria', '/themes/adat-jawa/demo/groom.jpg', 'Putra sulung yang bertekad membangun keluarga sakinah', 'randiwijaya', NULL, NULL, NULL, '1', '2026-03-08 16:39:17', '2026-03-08 16:39:17');
INSERT INTO `bride_grooms` VALUES (7, 3, 1, 'nama pria', 'panggilan pria', 'ayah pria', 'ibu pria', 'pria', NULL, 'bio pria', NULL, NULL, NULL, NULL, NULL, '2026-03-09 17:43:31', '2026-03-09 17:43:31');
INSERT INTO `bride_grooms` VALUES (8, 3, 2, 'nama wanita', 'panggilan wanita', 'nama ayah', 'nama ibu', 'wanita', NULL, 'bio wanita', NULL, NULL, NULL, NULL, NULL, '2026-03-09 17:43:31', '2026-03-09 17:43:31');

-- ----------------------------
-- Table structure for cache
-- ----------------------------
DROP TABLE IF EXISTS `cache`;
CREATE TABLE `cache`  (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`) USING BTREE,
  INDEX `cache_expiration_index`(`expiration` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of cache
-- ----------------------------
INSERT INTO `cache` VALUES ('undangan-digital-groovy-cache-1b6453892473a467d07372d45eb05abc2031647a', 'i:1;', 1773068169);
INSERT INTO `cache` VALUES ('undangan-digital-groovy-cache-1b6453892473a467d07372d45eb05abc2031647a:timer', 'i:1773068169;', 1773068169);
INSERT INTO `cache` VALUES ('undangan-digital-groovy-cache-admin@test.com|127.0.0.1', 'i:1;', 1773073087);
INSERT INTO `cache` VALUES ('undangan-digital-groovy-cache-admin@test.com|127.0.0.1:timer', 'i:1773073087;', 1773073087);
INSERT INTO `cache` VALUES ('undangan-digital-groovy-cache-akromadabi@gmail.com|127.0.0.1', 'i:1;', 1773068839);
INSERT INTO `cache` VALUES ('undangan-digital-groovy-cache-akromadabi@gmail.com|127.0.0.1:timer', 'i:1773068839;', 1773068839);

-- ----------------------------
-- Table structure for cache_locks
-- ----------------------------
DROP TABLE IF EXISTS `cache_locks`;
CREATE TABLE `cache_locks`  (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`) USING BTREE,
  INDEX `cache_locks_expiration_index`(`expiration` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of cache_locks
-- ----------------------------

-- ----------------------------
-- Table structure for events
-- ----------------------------
DROP TABLE IF EXISTS `events`;
CREATE TABLE `events`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `invitation_id` bigint UNSIGNED NOT NULL,
  `event_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'akad, pemberkatan, resepsi, lainnya',
  `event_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NULL DEFAULT NULL,
  `timezone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'WIB',
  `venue_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `venue_address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `gmaps_link` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `gmaps_embed` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT 'iframe embed google maps',
  `sort_order` tinyint NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `events_invitation_id_foreign`(`invitation_id` ASC) USING BTREE,
  CONSTRAINT `events_invitation_id_foreign` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of events
-- ----------------------------
INSERT INTO `events` VALUES (3, 1, 'akad', 'Akad Nikah', '2026-04-15', '08:00:00', '10:00:00', 'WIB', 'Masjid Agung Al-Ittihad', 'Jl. Raya Ciputat No. 15, Tangerang Selatan, Banten', 'https://maps.google.com', NULL, 1, '2026-03-08 16:39:17', '2026-03-08 16:39:17');
INSERT INTO `events` VALUES (4, 1, 'resepsi', 'Resepsi', '2026-04-15', '11:00:00', '14:00:00', 'WIB', 'Gedung Sasono Mulyo', 'Jl. Gatot Subroto No. 88, Jakarta Selatan', 'https://maps.google.com', NULL, 2, '2026-03-08 16:39:17', '2026-03-08 16:39:17');
INSERT INTO `events` VALUES (5, 3, 'akad', 'Akad Nikah', '2026-03-11', '02:43:00', '04:44:00', 'WIB', 'Aula', 'alamat', NULL, NULL, 0, '2026-03-09 17:44:59', '2026-03-09 17:44:59');

-- ----------------------------
-- Table structure for failed_jobs
-- ----------------------------
DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE `failed_jobs`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `failed_jobs_uuid_unique`(`uuid` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of failed_jobs
-- ----------------------------

-- ----------------------------
-- Table structure for features
-- ----------------------------
DROP TABLE IF EXISTS `features`;
CREATE TABLE `features`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` enum('content','settings','other') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'content',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `icon` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `features_slug_unique`(`slug` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of features
-- ----------------------------
INSERT INTO `features` VALUES (1, 'Opening', 'opening', 'content', NULL, 'MdOutlineWavingHand', '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `features` VALUES (2, 'Mempelai', 'bride_groom', 'content', NULL, 'MdPeople', '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `features` VALUES (3, 'Acara', 'event', 'content', NULL, 'MdEvent', '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `features` VALUES (4, 'Galeri', 'gallery', 'content', NULL, 'MdPhotoLibrary', '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `features` VALUES (5, 'Kisah Cinta', 'love_story', 'content', NULL, 'MdFavorite', '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `features` VALUES (6, 'Bank / E-Wallet', 'bank', 'content', NULL, 'MdAccountBalance', '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `features` VALUES (7, 'Penutup', 'closing', 'content', NULL, 'MdFlag', '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `features` VALUES (8, 'Guestbook', 'guestbook', 'content', NULL, 'MdMenuBook', '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `features` VALUES (9, 'Save The Date', 'save_the_date', 'content', NULL, 'MdCalendarToday', '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `features` VALUES (10, 'Turut Mengundang', 'turut_mengundang', 'content', NULL, 'MdGroups', '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `features` VALUES (11, 'BrideGroom Detail', 'bride_groom_detail', 'content', NULL, 'MdPersonPin', '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `features` VALUES (12, 'Cover', 'cover', 'settings', NULL, 'MdImage', '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `features` VALUES (13, 'Tamu', 'guest', 'settings', NULL, 'MdPersonAdd', '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `features` VALUES (14, 'RSVP', 'rsvp', 'settings', NULL, 'MdFactCheck', '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `features` VALUES (15, 'Musik', 'music', 'settings', NULL, 'MdMusicNote', '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `features` VALUES (16, 'Hadiah', 'gift', 'settings', NULL, 'MdCardGiftcard', '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `features` VALUES (17, 'Kirim WhatsApp', 'whatsapp', 'settings', NULL, 'MdWhatsapp', '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `features` VALUES (18, 'Template', 'template', 'settings', NULL, 'MdPalette', '2026-03-08 15:24:46', '2026-03-08 15:24:46');

-- ----------------------------
-- Table structure for galleries
-- ----------------------------
DROP TABLE IF EXISTS `galleries`;
CREATE TABLE `galleries`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `invitation_id` bigint UNSIGNED NOT NULL,
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `caption` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `galleries_invitation_id_foreign`(`invitation_id` ASC) USING BTREE,
  CONSTRAINT `galleries_invitation_id_foreign` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of galleries
-- ----------------------------
INSERT INTO `galleries` VALUES (4, 1, 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop', 'Foto 1', 1, '2026-03-08 16:39:17', '2026-03-08 16:39:17');
INSERT INTO `galleries` VALUES (5, 1, 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=400&fit=crop', 'Foto 2', 2, '2026-03-08 16:39:17', '2026-03-08 16:39:17');
INSERT INTO `galleries` VALUES (6, 1, 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&h=400&fit=crop', 'Foto 3', 3, '2026-03-08 16:39:17', '2026-03-08 16:39:17');
INSERT INTO `galleries` VALUES (7, 1, 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=400&fit=crop', 'Foto 4', 4, '2026-03-08 16:39:17', '2026-03-08 16:39:17');
INSERT INTO `galleries` VALUES (8, 1, 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400&h=400&fit=crop', 'Foto 5', 5, '2026-03-08 16:39:17', '2026-03-08 16:39:17');

-- ----------------------------
-- Table structure for gifts
-- ----------------------------
DROP TABLE IF EXISTS `gifts`;
CREATE TABLE `gifts`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `invitation_id` bigint UNSIGNED NOT NULL,
  `guest_id` bigint UNSIGNED NULL DEFAULT NULL,
  `sender_name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `gift_type` enum('transfer','barang') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'transfer',
  `amount` decimal(12, 2) NULL DEFAULT NULL,
  `item_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `confirmed` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `gifts_invitation_id_foreign`(`invitation_id` ASC) USING BTREE,
  INDEX `gifts_guest_id_foreign`(`guest_id` ASC) USING BTREE,
  CONSTRAINT `gifts_guest_id_foreign` FOREIGN KEY (`guest_id`) REFERENCES `guests` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  CONSTRAINT `gifts_invitation_id_foreign` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of gifts
-- ----------------------------

-- ----------------------------
-- Table structure for global_settings
-- ----------------------------
DROP TABLE IF EXISTS `global_settings`;
CREATE TABLE `global_settings`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `setting_value` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `setting_type` enum('string','number','boolean','json') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'string',
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'payment, whatsapp, general, seo',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `global_settings_setting_key_unique`(`setting_key` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of global_settings
-- ----------------------------
INSERT INTO `global_settings` VALUES (1, 'site_name', 'Undangan Digital Groovy', 'string', 'general', 'Nama situs', '2026-03-08 15:24:47', '2026-03-08 15:45:05');
INSERT INTO `global_settings` VALUES (2, 'site_domain', 'groovy.com', 'string', 'general', 'Domain utama', '2026-03-08 15:24:47', '2026-03-08 15:45:05');
INSERT INTO `global_settings` VALUES (3, 'site_tagline', 'Buat Undangan Digital Premium dalam Hitungan Menit', 'string', 'general', 'Tagline situs', '2026-03-08 15:24:47', '2026-03-08 15:45:05');
INSERT INTO `global_settings` VALUES (4, 'default_locale', 'id', 'string', 'general', 'Bahasa default (id/en)', '2026-03-08 15:24:47', '2026-03-08 15:45:05');
INSERT INTO `global_settings` VALUES (5, 'xendit_mode', 'sandbox', 'string', 'payment', 'Mode: sandbox / production', '2026-03-08 15:24:47', '2026-03-08 15:45:05');
INSERT INTO `global_settings` VALUES (6, 'xendit_secret_key', NULL, 'string', 'payment', 'Xendit Secret API Key', '2026-03-08 15:24:47', '2026-03-08 15:45:05');
INSERT INTO `global_settings` VALUES (7, 'xendit_webhook_token', NULL, 'string', 'payment', 'Xendit Webhook Verification Token', '2026-03-08 15:24:47', '2026-03-08 15:45:05');
INSERT INTO `global_settings` VALUES (8, 'xendit_success_url', '/dashboard?payment=success', 'string', 'payment', 'Redirect URL setelah bayar sukses', '2026-03-08 15:24:47', '2026-03-08 15:45:05');
INSERT INTO `global_settings` VALUES (9, 'xendit_failure_url', '/dashboard?payment=failed', 'string', 'payment', 'Redirect URL setelah bayar gagal', '2026-03-08 15:24:47', '2026-03-08 15:45:05');
INSERT INTO `global_settings` VALUES (10, 'mpwav9_api_url', 'https://serverwa.hello-inv.com/send-message', 'string', 'whatsapp', 'URL API MP WA V9 (contoh: https://api.mpwav9.com)', '2026-03-08 15:24:47', '2026-03-08 15:45:05');
INSERT INTO `global_settings` VALUES (11, 'mpwav9_api_token', 'skXUxgVjmF0xPr5symXK5cOv0PBFHb', 'string', 'whatsapp', 'Token API MP WA V9', '2026-03-08 15:24:47', '2026-03-08 15:45:05');
INSERT INTO `global_settings` VALUES (12, 'mpwav9_device_id', NULL, 'string', 'whatsapp', 'Device ID MP WA V9', '2026-03-08 15:24:47', '2026-03-08 15:45:05');
INSERT INTO `global_settings` VALUES (13, 'mpwav9_sender_number', '6283132211830', 'string', 'whatsapp', 'Nomor pengirim WA', '2026-03-08 15:24:47', '2026-03-08 15:45:05');

-- ----------------------------
-- Table structure for guests
-- ----------------------------
DROP TABLE IF EXISTS `guests`;
CREATE TABLE `guests`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `invitation_id` bigint UNSIGNED NOT NULL,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'untuk URL unik: domain.com/u/slug?to=guest-slug',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `email` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `group_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'kelompok: keluarga, teman, kantor',
  `max_pax` tinyint NOT NULL DEFAULT 2 COMMENT 'jumlah orang yang diundang',
  `wa_sent` tinyint(1) NOT NULL DEFAULT 0,
  `wa_sent_at` timestamp NULL DEFAULT NULL,
  `is_opened` tinyint(1) NOT NULL DEFAULT 0,
  `opened_at` timestamp NULL DEFAULT NULL,
  `checked_in` tinyint(1) NOT NULL DEFAULT 0,
  `checked_in_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `guests_invitation_id_slug_unique`(`invitation_id` ASC, `slug` ASC) USING BTREE,
  CONSTRAINT `guests_invitation_id_foreign` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of guests
-- ----------------------------
INSERT INTO `guests` VALUES (1, 1, 'Ahmad Fadhil', 'ahmad-fadhil', '081111111111', NULL, 'Keluarga', 2, 1, '2026-03-05 15:24:47', 1, '2026-03-06 15:24:47', 0, NULL, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `guests` VALUES (2, 1, 'Siti Aisyah', 'siti-aisyah', '081222222222', NULL, 'Keluarga', 2, 1, '2026-03-06 15:24:47', 1, '2026-03-07 15:24:47', 0, NULL, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `guests` VALUES (3, 1, 'Budi Hartono', 'budi-hartono', '081333333333', NULL, 'Kantor', 2, 1, '2026-03-07 15:24:47', 0, NULL, 0, NULL, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `guests` VALUES (4, 1, 'Dewi Sartika', 'dewi-sartika', '081444444444', NULL, 'Kantor', 2, 0, NULL, 0, NULL, 0, NULL, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `guests` VALUES (5, 1, 'Eko Prasetyo', 'eko-prasetyo', '081555555555', NULL, 'Teman', 2, 0, NULL, 0, NULL, 0, NULL, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `guests` VALUES (6, 1, 'Fitri Handayani', 'fitri-handayani', '081666666666', NULL, 'Teman', 2, 0, NULL, 0, NULL, 0, NULL, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `guests` VALUES (7, 1, 'Gunawan', 'gunawan', '081777777777', NULL, 'Teman', 2, 0, NULL, 0, NULL, 0, NULL, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `guests` VALUES (8, 1, 'Hesti Utami', 'hesti-utami', '081888888888', NULL, 'Teman', 2, 0, NULL, 0, NULL, 0, NULL, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `guests` VALUES (9, 1, 'Irfan Maulana', 'irfan-maulana', '081999999999', NULL, 'Kampus', 2, 0, NULL, 0, NULL, 0, NULL, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `guests` VALUES (10, 1, 'Joko Widodo', 'joko-widodo', '', NULL, 'Tetangga', 2, 0, NULL, 0, NULL, 0, NULL, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `guests` VALUES (11, 1, 'ANdi', 'andi', '085641647478', NULL, 'Keluarga', 1, 0, NULL, 0, NULL, 0, NULL, '2026-03-08 15:38:10', '2026-03-08 15:38:10');
INSERT INTO `guests` VALUES (12, 1, 'Andi', 'ixc6x', '085641647478', NULL, NULL, 1, 0, NULL, 0, NULL, 0, NULL, '2026-03-09 10:42:00', '2026-03-09 10:42:00');
INSERT INTO `guests` VALUES (13, 3, 'Andi', '8e8ms', '797597', NULL, NULL, 2, 0, NULL, 0, NULL, 0, NULL, '2026-03-09 19:09:10', '2026-03-09 19:09:10');
INSERT INTO `guests` VALUES (14, 1, 'Ardika', 'piohu', '57585678', NULL, NULL, 2, 0, NULL, 0, NULL, 0, NULL, '2026-03-09 21:22:25', '2026-03-09 21:22:25');

-- ----------------------------
-- Table structure for invitation_sections
-- ----------------------------
DROP TABLE IF EXISTS `invitation_sections`;
CREATE TABLE `invitation_sections`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `invitation_id` bigint UNSIGNED NOT NULL,
  `section_key` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `section_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int NOT NULL DEFAULT 0,
  `is_visible` tinyint(1) NOT NULL DEFAULT 1,
  `custom_config` json NULL COMMENT 'override konfigurasi section',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `invitation_sections_invitation_id_section_key_unique`(`invitation_id` ASC, `section_key` ASC) USING BTREE,
  CONSTRAINT `invitation_sections_invitation_id_foreign` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 86 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of invitation_sections
-- ----------------------------
INSERT INTO `invitation_sections` VALUES (12, 2, 'cover', 'Cover', 1, 1, NULL, '2026-03-08 15:24:48', '2026-03-08 15:24:48');
INSERT INTO `invitation_sections` VALUES (13, 2, 'opening', 'Opening', 2, 1, NULL, '2026-03-08 15:24:48', '2026-03-08 15:24:48');
INSERT INTO `invitation_sections` VALUES (14, 2, 'bride_groom', 'Mempelai', 3, 1, NULL, '2026-03-08 15:24:48', '2026-03-08 15:24:48');
INSERT INTO `invitation_sections` VALUES (15, 2, 'event', 'Acara', 4, 1, NULL, '2026-03-08 15:24:48', '2026-03-08 15:24:48');
INSERT INTO `invitation_sections` VALUES (16, 2, 'countdown', 'Save The Date', 5, 1, NULL, '2026-03-08 15:24:48', '2026-03-08 15:24:48');
INSERT INTO `invitation_sections` VALUES (17, 2, 'gallery', 'Galeri', 6, 1, NULL, '2026-03-08 15:24:48', '2026-03-08 15:24:48');
INSERT INTO `invitation_sections` VALUES (18, 2, 'love_story', 'Kisah Cinta', 7, 1, NULL, '2026-03-08 15:24:48', '2026-03-08 15:24:48');
INSERT INTO `invitation_sections` VALUES (19, 2, 'bank', 'Amplop Digital', 8, 1, NULL, '2026-03-08 15:24:48', '2026-03-08 15:24:48');
INSERT INTO `invitation_sections` VALUES (20, 2, 'rsvp', 'RSVP', 9, 1, NULL, '2026-03-08 15:24:48', '2026-03-08 15:24:48');
INSERT INTO `invitation_sections` VALUES (21, 2, 'wishes', 'Ucapan', 10, 1, NULL, '2026-03-08 15:24:48', '2026-03-08 15:24:48');
INSERT INTO `invitation_sections` VALUES (22, 2, 'closing', 'Penutup', 11, 1, NULL, '2026-03-08 15:24:48', '2026-03-08 15:24:48');
INSERT INTO `invitation_sections` VALUES (65, 1, 'cover', 'Cover', 1, 1, NULL, '2026-03-09 14:49:46', '2026-03-09 14:49:46');
INSERT INTO `invitation_sections` VALUES (66, 1, 'opening', 'Opening', 2, 1, NULL, '2026-03-09 14:49:46', '2026-03-09 14:49:46');
INSERT INTO `invitation_sections` VALUES (67, 1, 'bride_groom', 'Mempelai', 3, 1, NULL, '2026-03-09 14:49:46', '2026-03-09 14:49:46');
INSERT INTO `invitation_sections` VALUES (68, 1, 'event', 'Acara', 4, 1, NULL, '2026-03-09 14:49:46', '2026-03-09 14:49:46');
INSERT INTO `invitation_sections` VALUES (69, 1, 'countdown', 'Save The Date', 5, 1, NULL, '2026-03-09 14:49:46', '2026-03-09 14:49:46');
INSERT INTO `invitation_sections` VALUES (70, 1, 'gallery', 'Galeri', 6, 1, NULL, '2026-03-09 14:49:46', '2026-03-09 14:49:46');
INSERT INTO `invitation_sections` VALUES (71, 1, 'love_story', 'Kisah Cinta', 7, 1, NULL, '2026-03-09 14:49:46', '2026-03-09 14:49:46');
INSERT INTO `invitation_sections` VALUES (72, 1, 'bank', 'Amplop Digital', 8, 1, NULL, '2026-03-09 14:49:46', '2026-03-09 14:49:46');
INSERT INTO `invitation_sections` VALUES (73, 1, 'rsvp', 'RSVP', 9, 1, NULL, '2026-03-09 14:49:46', '2026-03-09 14:49:46');
INSERT INTO `invitation_sections` VALUES (74, 1, 'wishes', 'Ucapan', 10, 1, NULL, '2026-03-09 14:49:46', '2026-03-09 14:49:46');
INSERT INTO `invitation_sections` VALUES (75, 1, 'closing', 'Penutup', 11, 1, NULL, '2026-03-09 14:49:46', '2026-03-09 14:49:46');
INSERT INTO `invitation_sections` VALUES (76, 3, 'cover', 'Cover', 1, 1, NULL, '2026-03-09 17:45:04', '2026-03-09 17:45:04');
INSERT INTO `invitation_sections` VALUES (77, 3, 'opening', 'Opening', 2, 1, NULL, '2026-03-09 17:45:04', '2026-03-09 17:45:04');
INSERT INTO `invitation_sections` VALUES (78, 3, 'bride_groom', 'Mempelai', 3, 1, NULL, '2026-03-09 17:45:04', '2026-03-09 17:45:04');
INSERT INTO `invitation_sections` VALUES (79, 3, 'event', 'Acara', 4, 1, NULL, '2026-03-09 17:45:04', '2026-03-09 17:45:04');
INSERT INTO `invitation_sections` VALUES (80, 3, 'gallery', 'Galeri', 6, 1, NULL, '2026-03-09 17:45:04', '2026-03-09 17:45:04');
INSERT INTO `invitation_sections` VALUES (81, 3, 'love_story', 'Kisah Cinta', 7, 1, NULL, '2026-03-09 17:45:04', '2026-03-09 17:45:04');
INSERT INTO `invitation_sections` VALUES (82, 3, 'bank', 'Amplop Digital', 8, 1, NULL, '2026-03-09 17:45:04', '2026-03-09 17:45:04');
INSERT INTO `invitation_sections` VALUES (83, 3, 'rsvp', 'RSVP', 9, 1, NULL, '2026-03-09 17:45:04', '2026-03-09 17:45:04');
INSERT INTO `invitation_sections` VALUES (84, 3, 'wishes', 'Ucapan', 10, 1, NULL, '2026-03-09 17:45:04', '2026-03-09 17:45:04');
INSERT INTO `invitation_sections` VALUES (85, 3, 'closing', 'Penutup', 11, 1, NULL, '2026-03-09 17:45:04', '2026-03-09 17:45:04');

-- ----------------------------
-- Table structure for invitations
-- ----------------------------
DROP TABLE IF EXISTS `invitations`;
CREATE TABLE `invitations`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `theme_id` bigint UNSIGNED NULL DEFAULT NULL,
  `slug` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'URL: domain.com/u/{slug}',
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `opening_title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `opening_text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `opening_ayat` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT 'ayat/kutipan pembuka',
  `closing_title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `closing_text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `cover_image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `cover_title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `cover_subtitle` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `layout_mode` enum('scroll','slide','tab') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'scroll',
  `show_side_menu` tinyint(1) NOT NULL DEFAULT 0,
  `music_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `music_autoplay` tinyint(1) NOT NULL DEFAULT 1,
  `save_the_date_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `countdown_target_date` datetime NULL DEFAULT NULL,
  `turut_mengundang_text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `show_photos` tinyint(1) NOT NULL DEFAULT 1,
  `show_animations` tinyint(1) NOT NULL DEFAULT 1,
  `show_guest_name` tinyint(1) NOT NULL DEFAULT 1,
  `show_countdown` tinyint(1) NOT NULL DEFAULT 1,
  `show_qr_code` tinyint(1) NOT NULL DEFAULT 0,
  `enable_rsvp` tinyint(1) NOT NULL DEFAULT 1,
  `enable_wishes` tinyint(1) NOT NULL DEFAULT 1,
  `language` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'id',
  `is_private` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Tidak muncul di Google/landing',
  `enable_qr` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Tombol QR aktif di undangan',
  `hide_photos` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Mode tanpa foto',
  `gallery_mode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'grid' COMMENT 'grid, carousel, slide',
  `live_delay` tinyint UNSIGNED NOT NULL DEFAULT 3 COMMENT 'seconds delay for name display',
  `live_counter` tinyint(1) NOT NULL DEFAULT 1,
  `live_template` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'elegant' COMMENT 'elegant, celebration',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `invitations_slug_unique`(`slug` ASC) USING BTREE,
  INDEX `invitations_user_id_foreign`(`user_id` ASC) USING BTREE,
  INDEX `invitations_theme_id_foreign`(`theme_id` ASC) USING BTREE,
  CONSTRAINT `invitations_theme_id_foreign` FOREIGN KEY (`theme_id`) REFERENCES `themes` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  CONSTRAINT `invitations_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of invitations
-- ----------------------------
INSERT INTO `invitations` VALUES (1, 2, 6, 'mira-randi', 'Pernikahan Mira & Randi', 'Bismillahirrahmanirrahim', 'Assalamualaikum Wr. Wb.\n\nDengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan putra-putri kami.\n\nKami mengundang Bapak/Ibu/Saudara/i untuk turut hadir dan memberikan doa restu.', 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً', 'Wassalamualaikum Wr. Wb.', 'Atas kehadiran dan doa restu dari Bapak/Ibu/Saudara/i sekalian, kami mengucapkan terima kasih.\n\nSemoga Allah SWT membalas kebaikan kalian.', '/storage/covers/ZugED45aSOABZS85qzV5BTib8cZU9Lvhngbi3NV7.jpg', 'The Wedding Of', 'Mira & Randi', 'tab', 0, '/storage/music/2HYRGURH14Poq7bpsMfxYOT7poMMrUGb7QRXRgMO.mp3', 1, 0, NULL, NULL, 0, 1, 1, 1, 1, 1, 1, 1, 1, 'id', 0, 1, 0, 'grid', 3, 1, 'celebration', '2026-03-08 15:24:47', '2026-03-09 21:20:22');
INSERT INTO `invitations` VALUES (2, 3, 4, 'andi-sari', 'Pernikahan Andi & Sari', 'Bismillah', 'Dengan memohon ridho Allah SWT, kami mengundang Anda.', NULL, 'Terima Kasih', 'Terima kasih atas doa dan kehadirannya.', NULL, 'The Wedding Of', 'Andi & Sari', 'scroll', 0, NULL, 1, 0, NULL, NULL, 0, 1, 1, 1, 1, 1, 0, 1, 1, 'id', 0, 1, 0, 'grid', 3, 1, 'elegant', '2026-03-08 15:24:48', '2026-03-08 15:24:48');
INSERT INTO `invitations` VALUES (3, 5, 5, 'andi', NULL, 'Bismillahirrahmanirrahim', 'Assalamu\'alaikum Warahmatullahi Wabarakatuh\n\nDengan memohon Rahmat dan Ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan putra-putri kami.', 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً', NULL, NULL, NULL, NULL, NULL, 'scroll', 0, NULL, 1, 0, NULL, NULL, 0, 1, 1, 0, 1, 1, 1, 1, 1, 'en', 0, 1, 0, 'grid', 3, 1, 'elegant', '2026-03-09 17:42:06', '2026-03-09 18:59:59');

-- ----------------------------
-- Table structure for job_batches
-- ----------------------------
DROP TABLE IF EXISTS `job_batches`;
CREATE TABLE `job_batches`  (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `cancelled_at` int NULL DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of job_batches
-- ----------------------------

-- ----------------------------
-- Table structure for jobs
-- ----------------------------
DROP TABLE IF EXISTS `jobs`;
CREATE TABLE `jobs`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED NULL DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `jobs_queue_index`(`queue` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of jobs
-- ----------------------------

-- ----------------------------
-- Table structure for love_stories
-- ----------------------------
DROP TABLE IF EXISTS `love_stories`;
CREATE TABLE `love_stories`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `invitation_id` bigint UNSIGNED NOT NULL,
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `story_date` date NULL DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `love_stories_invitation_id_foreign`(`invitation_id` ASC) USING BTREE,
  CONSTRAINT `love_stories_invitation_id_foreign` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of love_stories
-- ----------------------------
INSERT INTO `love_stories` VALUES (1, 1, 'Pertama Bertemu', '2023-03-08', 'Kami pertama kali bertemu di acara reuni kampus. Saat itu mata kami bertemu dan semuanya terasa berbeda.', NULL, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `love_stories` VALUES (2, 1, 'Mulai Berpacaran', '2023-09-08', 'Setelah sering ngobrol dan jalan berdua, akhirnya Randi memberanikan diri untuk menyatakan perasaannya.', NULL, 2, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `love_stories` VALUES (3, 1, 'Lamaran', '2025-12-08', 'Di sebuah restoran rooftop dengan pemandangan kota Jakarta, Randi berlutut dan berkata \"Maukah kamu menikah denganku?\"', NULL, 3, '2026-03-08 15:24:47', '2026-03-08 15:24:47');

-- ----------------------------
-- Table structure for migrations
-- ----------------------------
DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 33 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of migrations
-- ----------------------------
INSERT INTO `migrations` VALUES (1, '0001_01_01_000000_create_users_table', 1);
INSERT INTO `migrations` VALUES (2, '0001_01_01_000001_create_cache_table', 1);
INSERT INTO `migrations` VALUES (3, '0001_01_01_000002_create_jobs_table', 1);
INSERT INTO `migrations` VALUES (4, '2025_01_01_000001_create_subscription_plans_table', 1);
INSERT INTO `migrations` VALUES (5, '2025_01_01_000002_create_features_table', 1);
INSERT INTO `migrations` VALUES (6, '2025_01_01_000003_create_plan_feature_access_table', 1);
INSERT INTO `migrations` VALUES (7, '2025_01_01_000004_create_payments_table', 1);
INSERT INTO `migrations` VALUES (8, '2025_01_01_000005_create_subscriptions_table', 1);
INSERT INTO `migrations` VALUES (9, '2025_01_01_000006_create_themes_table', 1);
INSERT INTO `migrations` VALUES (10, '2025_01_01_000007_create_theme_sections_table', 1);
INSERT INTO `migrations` VALUES (11, '2025_01_01_000008_create_invitations_table', 1);
INSERT INTO `migrations` VALUES (12, '2025_01_01_000009_create_invitation_sections_table', 1);
INSERT INTO `migrations` VALUES (13, '2025_01_01_000010_create_bride_grooms_table', 1);
INSERT INTO `migrations` VALUES (14, '2025_01_01_000011_create_events_table', 1);
INSERT INTO `migrations` VALUES (15, '2025_01_01_000012_create_galleries_table', 1);
INSERT INTO `migrations` VALUES (16, '2025_01_01_000013_create_love_stories_table', 1);
INSERT INTO `migrations` VALUES (17, '2025_01_01_000014_create_bank_accounts_table', 1);
INSERT INTO `migrations` VALUES (18, '2025_01_01_000015_create_guests_table', 1);
INSERT INTO `migrations` VALUES (19, '2025_01_01_000016_create_rsvps_table', 1);
INSERT INTO `migrations` VALUES (20, '2025_01_01_000017_create_wishes_table', 1);
INSERT INTO `migrations` VALUES (21, '2025_01_01_000018_create_gifts_table', 1);
INSERT INTO `migrations` VALUES (22, '2025_01_01_000019_create_global_settings_table', 1);
INSERT INTO `migrations` VALUES (23, '2025_01_01_000020_create_whatsapp_logs_table', 1);
INSERT INTO `migrations` VALUES (24, '2025_03_09_000001_add_checkin_to_guests_table', 2);
INSERT INTO `migrations` VALUES (25, '2025_03_09_000002_add_privacy_to_invitations_table', 3);
INSERT INTO `migrations` VALUES (26, '2025_03_09_000003_add_gallery_mode_to_invitations_table', 4);
INSERT INTO `migrations` VALUES (27, '2025_03_09_000004_add_live_settings_to_invitations_table', 5);
INSERT INTO `migrations` VALUES (28, '2025_03_09_000005_create_music_library_table', 6);
INSERT INTO `migrations` VALUES (29, '2025_03_09_000006_add_adat_sunda_theme', 7);
INSERT INTO `migrations` VALUES (30, '2026_03_09_170918_add_otp_fields_to_users_table', 8);
INSERT INTO `migrations` VALUES (31, '2026_03_09_183221_add_settings_columns_to_invitations_table', 9);
INSERT INTO `migrations` VALUES (32, '2026_03_09_192047_add_show_side_menu_to_invitations_table', 10);

-- ----------------------------
-- Table structure for music_library
-- ----------------------------
DROP TABLE IF EXISTS `music_library`;
CREATE TABLE `music_library`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `artist` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'romantis',
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'url',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of music_library
-- ----------------------------
INSERT INTO `music_library` VALUES (2, 'Its You', 'Sezairi', 'romantis', '/storage/music/gJsseddV6plRgCmYQRLqTW7WUP7fhCZUQNrVPw6B.mp3', 'upload', 1, 0, '2026-03-09 16:23:15', '2026-03-09 16:23:15');
INSERT INTO `music_library` VALUES (3, 'Nadlif Basalamah', 'Nadlif Basalamah', 'romantis', '/storage/music/2HYRGURH14Poq7bpsMfxYOT7poMMrUGb7QRXRgMO.mp3', 'upload', 1, 0, '2026-03-09 16:24:42', '2026-03-09 16:24:42');

-- ----------------------------
-- Table structure for password_reset_tokens
-- ----------------------------
DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE `password_reset_tokens`  (
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of password_reset_tokens
-- ----------------------------

-- ----------------------------
-- Table structure for payments
-- ----------------------------
DROP TABLE IF EXISTS `payments`;
CREATE TABLE `payments`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `plan_id` bigint UNSIGNED NOT NULL,
  `amount` decimal(12, 2) NOT NULL,
  `payment_method` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'bank_transfer, ewallet, qris',
  `payment_gateway` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'xendit',
  `gateway_order_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `gateway_transaction_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `external_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `status` enum('pending','paid','failed','refunded','expired') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `paid_at` timestamp NULL DEFAULT NULL,
  `metadata` json NULL COMMENT 'data tambahan dari gateway',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `payments_plan_id_foreign`(`plan_id` ASC) USING BTREE,
  INDEX `payments_user_id_status_index`(`user_id` ASC, `status` ASC) USING BTREE,
  CONSTRAINT `payments_plan_id_foreign` FOREIGN KEY (`plan_id`) REFERENCES `subscription_plans` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `payments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of payments
-- ----------------------------
INSERT INTO `payments` VALUES (1, 2, 3, 99000.00, NULL, 'xendit', NULL, NULL, NULL, 'paid', '2026-03-03 15:24:47', NULL, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `payments` VALUES (2, 5, 2, 49000.00, NULL, 'xendit', NULL, NULL, NULL, 'pending', NULL, NULL, '2026-03-09 18:06:54', '2026-03-09 18:06:54');

-- ----------------------------
-- Table structure for plan_feature_access
-- ----------------------------
DROP TABLE IF EXISTS `plan_feature_access`;
CREATE TABLE `plan_feature_access`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `plan_id` bigint UNSIGNED NOT NULL,
  `feature_id` bigint UNSIGNED NOT NULL,
  `is_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `plan_feature_access_plan_id_feature_id_unique`(`plan_id` ASC, `feature_id` ASC) USING BTREE,
  INDEX `plan_feature_access_feature_id_foreign`(`feature_id` ASC) USING BTREE,
  CONSTRAINT `plan_feature_access_feature_id_foreign` FOREIGN KEY (`feature_id`) REFERENCES `features` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `plan_feature_access_plan_id_foreign` FOREIGN KEY (`plan_id`) REFERENCES `subscription_plans` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 73 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of plan_feature_access
-- ----------------------------
INSERT INTO `plan_feature_access` VALUES (1, 1, 1, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (2, 1, 2, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (3, 1, 3, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (4, 1, 4, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (5, 1, 5, 0, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (6, 1, 6, 0, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (7, 1, 7, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (8, 1, 8, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (9, 1, 9, 0, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (10, 1, 10, 0, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (11, 1, 11, 0, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (12, 1, 12, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (13, 1, 13, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (14, 1, 14, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (15, 1, 15, 0, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (16, 1, 16, 0, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (17, 1, 17, 0, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (18, 1, 18, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (19, 2, 1, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (20, 2, 2, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (21, 2, 3, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (22, 2, 4, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (23, 2, 5, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (24, 2, 6, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (25, 2, 7, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (26, 2, 8, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (27, 2, 9, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (28, 2, 10, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (29, 2, 11, 0, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (30, 2, 12, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (31, 2, 13, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (32, 2, 14, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (33, 2, 15, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (34, 2, 16, 0, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (35, 2, 17, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (36, 2, 18, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (37, 3, 1, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (38, 3, 2, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (39, 3, 3, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (40, 3, 4, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (41, 3, 5, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (42, 3, 6, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (43, 3, 7, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (44, 3, 8, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (45, 3, 9, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (46, 3, 10, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (47, 3, 11, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (48, 3, 12, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (49, 3, 13, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (50, 3, 14, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (51, 3, 15, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (52, 3, 16, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (53, 3, 17, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (54, 3, 18, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (55, 4, 1, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (56, 4, 2, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (57, 4, 3, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (58, 4, 4, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (59, 4, 5, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (60, 4, 6, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (61, 4, 7, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (62, 4, 8, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (63, 4, 9, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (64, 4, 10, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (65, 4, 11, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (66, 4, 12, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (67, 4, 13, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (68, 4, 14, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (69, 4, 15, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (70, 4, 16, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (71, 4, 17, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `plan_feature_access` VALUES (72, 4, 18, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');

-- ----------------------------
-- Table structure for rsvps
-- ----------------------------
DROP TABLE IF EXISTS `rsvps`;
CREATE TABLE `rsvps`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `guest_id` bigint UNSIGNED NOT NULL,
  `invitation_id` bigint UNSIGNED NOT NULL,
  `attendance` enum('hadir','tidak_hadir','belum_pasti') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `number_of_guests` tinyint NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `rsvps_guest_id_foreign`(`guest_id` ASC) USING BTREE,
  INDEX `rsvps_invitation_id_foreign`(`invitation_id` ASC) USING BTREE,
  CONSTRAINT `rsvps_guest_id_foreign` FOREIGN KEY (`guest_id`) REFERENCES `guests` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `rsvps_invitation_id_foreign` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of rsvps
-- ----------------------------
INSERT INTO `rsvps` VALUES (1, 1, 1, 'hadir', 2, '2026-03-08 15:24:48', '2026-03-08 15:24:48');
INSERT INTO `rsvps` VALUES (2, 2, 1, 'hadir', 1, '2026-03-08 15:24:48', '2026-03-08 15:24:48');
INSERT INTO `rsvps` VALUES (3, 5, 1, 'belum_pasti', 1, '2026-03-08 15:24:48', '2026-03-08 15:24:48');

-- ----------------------------
-- Table structure for sessions
-- ----------------------------
DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions`  (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED NULL DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `sessions_user_id_index`(`user_id` ASC) USING BTREE,
  INDEX `sessions_last_activity_index`(`last_activity` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sessions
-- ----------------------------
INSERT INTO `sessions` VALUES ('IHCZMVSAdoI2mTahyjMiU8XuUw5VGTlmd1f4UyE5', 1, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiRkU3T0hLVDFJUXVnU09uQVRMQU05V1RTTEJ3VjcwQ1RIMmhMSmRDSSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTtzOjk6Il9wcmV2aW91cyI7YToyOntzOjM6InVybCI7czozNDoiaHR0cDovL2xvY2FsaG9zdDo4MDAwL3UvbWlyYS1yYW5kaSI7czo1OiJyb3V0ZSI7czoxNToiaW52aXRhdGlvbi5zaG93Ijt9fQ==', 1773085865);
INSERT INTO `sessions` VALUES ('p5JKa0cLj8IbJyg8yXrd9852hOA8Gz7jVgBqnoYn', 1, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieWMxb1dHQ05kZFNLejRGMXZIMnJHQTBMbEVYRUFyNVRqU1BYRDAwViI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTt9', 1773092749);
INSERT INTO `sessions` VALUES ('YHYLj4qcOr7RXrGvs2jInn4AXFyFGvtwt019t2S5', 2, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiQmJMRmxSd0xpdmt4eTYydURiSjA0eThua0NSNElUMDdUeE92dUg2OCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC91L21pcmEtcmFuZGk/dG89YWhtYWQtZmFkaGlsIjtzOjU6InJvdXRlIjtzOjE1OiJpbnZpdGF0aW9uLnNob3ciO31zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToyO30=', 1773085032);

-- ----------------------------
-- Table structure for subscription_plans
-- ----------------------------
DROP TABLE IF EXISTS `subscription_plans`;
CREATE TABLE `subscription_plans`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `price` decimal(12, 2) NOT NULL DEFAULT 0.00,
  `duration_days` int NOT NULL DEFAULT 0 COMMENT '0 = unlimited/free',
  `max_guests` int NOT NULL DEFAULT 100,
  `max_galleries` int NOT NULL DEFAULT 5,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` tinyint NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `subscription_plans_slug_unique`(`slug` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of subscription_plans
-- ----------------------------
INSERT INTO `subscription_plans` VALUES (1, 'Free', 'free', 'Paket gratis dengan fitur terbatas', 0.00, 0, 50, 3, 1, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `subscription_plans` VALUES (2, 'Silver', 'silver', 'Paket dasar untuk undangan digital', 49000.00, 90, 200, 10, 1, 2, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `subscription_plans` VALUES (3, 'Gold', 'gold', 'Paket lengkap dengan semua fitur', 99000.00, 180, 500, 25, 1, 3, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `subscription_plans` VALUES (4, 'Platinum', 'platinum', 'Paket premium tanpa batas', 199000.00, 365, 9999, 50, 1, 4, '2026-03-08 15:24:46', '2026-03-08 15:24:46');

-- ----------------------------
-- Table structure for subscriptions
-- ----------------------------
DROP TABLE IF EXISTS `subscriptions`;
CREATE TABLE `subscriptions`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `plan_id` bigint UNSIGNED NOT NULL,
  `status` enum('active','expired','cancelled','pending') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `starts_at` timestamp NOT NULL,
  `expires_at` timestamp NULL DEFAULT NULL COMMENT 'NULL = tidak expire (free plan)',
  `payment_id` bigint UNSIGNED NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `subscriptions_plan_id_foreign`(`plan_id` ASC) USING BTREE,
  INDEX `subscriptions_payment_id_foreign`(`payment_id` ASC) USING BTREE,
  INDEX `subscriptions_user_id_status_index`(`user_id` ASC, `status` ASC) USING BTREE,
  CONSTRAINT `subscriptions_payment_id_foreign` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  CONSTRAINT `subscriptions_plan_id_foreign` FOREIGN KEY (`plan_id`) REFERENCES `subscription_plans` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `subscriptions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of subscriptions
-- ----------------------------
INSERT INTO `subscriptions` VALUES (1, 2, 3, 'active', '2026-03-03 15:24:47', '2026-08-30 15:24:47', 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `subscriptions` VALUES (2, 4, 2, 'active', '2026-03-09 16:00:26', '2027-03-09 16:00:26', NULL, '2026-03-09 16:00:26', '2026-03-09 16:00:26');
INSERT INTO `subscriptions` VALUES (3, 5, 1, 'active', '2026-03-09 17:45:04', NULL, NULL, '2026-03-09 17:45:04', '2026-03-09 18:06:35');

-- ----------------------------
-- Table structure for theme_sections
-- ----------------------------
DROP TABLE IF EXISTS `theme_sections`;
CREATE TABLE `theme_sections`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `theme_id` bigint UNSIGNED NOT NULL,
  `section_key` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'cover, opening, bride_groom, event, gallery, love_story, bank, rsvp, wishes, closing, save_the_date, turut_mengundang, music',
  `section_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `component_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'nama React component',
  `default_order` int NOT NULL DEFAULT 0,
  `is_removable` tinyint(1) NOT NULL DEFAULT 1,
  `is_default` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `theme_sections_theme_id_foreign`(`theme_id` ASC) USING BTREE,
  CONSTRAINT `theme_sections_theme_id_foreign` FOREIGN KEY (`theme_id`) REFERENCES `themes` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 66 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of theme_sections
-- ----------------------------
INSERT INTO `theme_sections` VALUES (1, 1, 'cover', 'Cover', 'CoverSection', 1, 0, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `theme_sections` VALUES (2, 1, 'opening', 'Opening', 'OpeningSection', 2, 1, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `theme_sections` VALUES (3, 1, 'bride_groom', 'Mempelai', 'BrideGroomSection', 3, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (4, 1, 'event', 'Acara', 'EventSection', 4, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (5, 1, 'countdown', 'Save The Date', 'CountdownSection', 5, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (6, 1, 'gallery', 'Galeri', 'GallerySection', 6, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (7, 1, 'love_story', 'Kisah Cinta', 'LoveStorySection', 7, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (8, 1, 'bank', 'Amplop Digital', 'BankSection', 8, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (9, 1, 'rsvp', 'RSVP', 'RsvpSection', 9, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (10, 1, 'wishes', 'Ucapan', 'WishesSection', 10, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (11, 1, 'closing', 'Penutup', 'ClosingSection', 11, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (12, 2, 'cover', 'Cover', 'CoverSection', 1, 0, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (13, 2, 'opening', 'Opening', 'OpeningSection', 2, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (14, 2, 'bride_groom', 'Mempelai', 'BrideGroomSection', 3, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (15, 2, 'event', 'Acara', 'EventSection', 4, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (16, 2, 'countdown', 'Save The Date', 'CountdownSection', 5, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (17, 2, 'gallery', 'Galeri', 'GallerySection', 6, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (18, 2, 'love_story', 'Kisah Cinta', 'LoveStorySection', 7, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (19, 2, 'bank', 'Amplop Digital', 'BankSection', 8, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (20, 2, 'rsvp', 'RSVP', 'RsvpSection', 9, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (21, 2, 'wishes', 'Ucapan', 'WishesSection', 10, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (22, 2, 'closing', 'Penutup', 'ClosingSection', 11, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (23, 3, 'cover', 'Cover', 'CoverSection', 1, 0, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (24, 3, 'opening', 'Opening', 'OpeningSection', 2, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (25, 3, 'bride_groom', 'Mempelai', 'BrideGroomSection', 3, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (26, 3, 'event', 'Acara', 'EventSection', 4, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (27, 3, 'countdown', 'Save The Date', 'CountdownSection', 5, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (28, 3, 'gallery', 'Galeri', 'GallerySection', 6, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (29, 3, 'love_story', 'Kisah Cinta', 'LoveStorySection', 7, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (30, 3, 'bank', 'Amplop Digital', 'BankSection', 8, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (31, 3, 'rsvp', 'RSVP', 'RsvpSection', 9, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (32, 3, 'wishes', 'Ucapan', 'WishesSection', 10, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (33, 3, 'closing', 'Penutup', 'ClosingSection', 11, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (34, 4, 'cover', 'Cover', 'CoverSection', 1, 0, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (35, 4, 'opening', 'Opening', 'OpeningSection', 2, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (36, 4, 'bride_groom', 'Mempelai', 'BrideGroomSection', 3, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (37, 4, 'event', 'Acara', 'EventSection', 4, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (38, 4, 'countdown', 'Save The Date', 'CountdownSection', 5, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (39, 4, 'gallery', 'Galeri', 'GallerySection', 6, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (40, 4, 'love_story', 'Kisah Cinta', 'LoveStorySection', 7, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (41, 4, 'bank', 'Amplop Digital', 'BankSection', 8, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (42, 4, 'rsvp', 'RSVP', 'RsvpSection', 9, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (43, 4, 'wishes', 'Ucapan', 'WishesSection', 10, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (44, 4, 'closing', 'Penutup', 'ClosingSection', 11, 1, 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `theme_sections` VALUES (45, 5, 'cover', 'Cover', 'CoverSection', 1, 0, 1, '2026-03-08 16:28:42', '2026-03-08 16:28:42');
INSERT INTO `theme_sections` VALUES (46, 5, 'opening', 'Opening', 'OpeningSection', 2, 1, 1, '2026-03-08 16:28:42', '2026-03-08 16:28:42');
INSERT INTO `theme_sections` VALUES (47, 5, 'bride_groom', 'Mempelai', 'BrideGroomSection', 3, 1, 1, '2026-03-08 16:28:42', '2026-03-08 16:28:42');
INSERT INTO `theme_sections` VALUES (48, 5, 'event', 'Acara', 'EventSection', 4, 1, 1, '2026-03-08 16:28:42', '2026-03-08 16:28:42');
INSERT INTO `theme_sections` VALUES (49, 5, 'gallery', 'Galeri', 'GallerySection', 6, 1, 1, '2026-03-08 16:28:42', '2026-03-08 16:28:42');
INSERT INTO `theme_sections` VALUES (50, 5, 'love_story', 'Kisah Cinta', 'LoveStorySection', 7, 1, 1, '2026-03-08 16:28:42', '2026-03-08 16:28:42');
INSERT INTO `theme_sections` VALUES (51, 5, 'bank', 'Amplop Digital', 'BankSection', 8, 1, 1, '2026-03-08 16:28:42', '2026-03-08 16:28:42');
INSERT INTO `theme_sections` VALUES (52, 5, 'rsvp', 'RSVP', 'RsvpSection', 9, 1, 1, '2026-03-08 16:28:42', '2026-03-08 16:28:42');
INSERT INTO `theme_sections` VALUES (53, 5, 'wishes', 'Ucapan', 'WishesSection', 10, 1, 1, '2026-03-08 16:28:42', '2026-03-08 16:28:42');
INSERT INTO `theme_sections` VALUES (54, 5, 'closing', 'Penutup', 'ClosingSection', 11, 1, 1, '2026-03-08 16:28:42', '2026-03-08 16:28:42');
INSERT INTO `theme_sections` VALUES (55, 6, 'cover', 'Cover', 'CoverSection', 1, 0, 1, '2026-03-09 13:15:17', '2026-03-09 13:15:17');
INSERT INTO `theme_sections` VALUES (56, 6, 'opening', 'Opening', 'OpeningSection', 2, 1, 1, '2026-03-09 13:15:17', '2026-03-09 13:15:17');
INSERT INTO `theme_sections` VALUES (57, 6, 'bride_groom', 'Mempelai', 'BrideGroomSection', 3, 1, 1, '2026-03-09 13:15:17', '2026-03-09 13:15:17');
INSERT INTO `theme_sections` VALUES (58, 6, 'event', 'Acara', 'EventSection', 4, 1, 1, '2026-03-09 13:15:17', '2026-03-09 13:15:17');
INSERT INTO `theme_sections` VALUES (59, 6, 'countdown', 'Save The Date', 'CountdownSection', 5, 1, 1, '2026-03-09 13:15:17', '2026-03-09 13:15:17');
INSERT INTO `theme_sections` VALUES (60, 6, 'gallery', 'Galeri', 'GallerySection', 6, 1, 1, '2026-03-09 13:15:17', '2026-03-09 13:15:17');
INSERT INTO `theme_sections` VALUES (61, 6, 'love_story', 'Kisah Cinta', 'LoveStorySection', 7, 1, 1, '2026-03-09 13:15:17', '2026-03-09 13:15:17');
INSERT INTO `theme_sections` VALUES (62, 6, 'bank', 'Amplop Digital', 'BankSection', 8, 1, 1, '2026-03-09 13:15:17', '2026-03-09 13:15:17');
INSERT INTO `theme_sections` VALUES (63, 6, 'rsvp', 'RSVP', 'RsvpSection', 9, 1, 1, '2026-03-09 13:15:17', '2026-03-09 13:15:17');
INSERT INTO `theme_sections` VALUES (64, 6, 'wishes', 'Ucapan', 'WishesSection', 10, 1, 1, '2026-03-09 13:15:17', '2026-03-09 13:15:17');
INSERT INTO `theme_sections` VALUES (65, 6, 'closing', 'Penutup', 'ClosingSection', 11, 1, 1, '2026-03-09 13:15:17', '2026-03-09 13:15:17');

-- ----------------------------
-- Table structure for themes
-- ----------------------------
DROP TABLE IF EXISTS `themes`;
CREATE TABLE `themes`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `thumbnail` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `preview_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'floral, elegant, rustic, modern, islamic',
  `color_scheme` json NULL COMMENT '{\"primary\":\"#xxx\",\"secondary\":\"#xxx\",\"accent\":\"#xxx\",\"bg\":\"#xxx\",\"text\":\"#xxx\"}',
  `font_config` json NULL COMMENT '{\"heading\":\"font\",\"body\":\"font\",\"script\":\"font\"}',
  `css_file` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `supports_scroll` tinyint(1) NOT NULL DEFAULT 1,
  `supports_slide` tinyint(1) NOT NULL DEFAULT 1,
  `supports_tab` tinyint(1) NOT NULL DEFAULT 1,
  `is_premium` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `themes_slug_unique`(`slug` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of themes
-- ----------------------------
INSERT INTO `themes` VALUES (1, 'Elegant Rose', 'elegant-rose', '/themes/elegant-rose/thumbnail.jpg', NULL, 'floral', '{\"bg\": \"#FFF9F5\", \"text\": \"#2D2D2D\", \"accent\": \"#C49A6C\", \"primary\": \"#B76E79\", \"secondary\": \"#F5E6E0\"}', '{\"body\": \"Inter\", \"script\": \"Great Vibes\", \"heading\": \"Playfair Display\"}', NULL, 1, 1, 1, 0, 1, 1, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `themes` VALUES (2, 'Garden Navy', 'garden-navy', '/themes/garden-navy/thumbnail.jpg', NULL, 'elegant', '{\"bg\": \"#0D1B2A\", \"text\": \"#F0E6D3\", \"accent\": \"#C8A951\", \"primary\": \"#1B3A5C\", \"secondary\": \"#E8D5B7\"}', '{\"body\": \"Lato\", \"script\": \"Dancing Script\", \"heading\": \"Cormorant Garamond\"}', NULL, 1, 1, 1, 0, 1, 2, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `themes` VALUES (3, 'Modern Black', 'modern-black', '/themes/modern-black/thumbnail.jpg', NULL, 'modern', '{\"bg\": \"#000000\", \"text\": \"#FFFFFF\", \"accent\": \"#FFFFFF\", \"primary\": \"#FFD700\", \"secondary\": \"#1A1A1A\"}', '{\"body\": \"Poppins\", \"script\": \"Sacramento\", \"heading\": \"Montserrat\"}', NULL, 1, 1, 1, 1, 1, 3, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `themes` VALUES (4, 'Islamic Green', 'islamic-green', '/themes/islamic-green/thumbnail.jpg', NULL, 'islamic', '{\"bg\": \"#F0FFF4\", \"text\": \"#1B4332\", \"accent\": \"#C8A951\", \"primary\": \"#2D6A4F\", \"secondary\": \"#D8F3DC\"}', '{\"body\": \"Inter\", \"script\": \"Arizonia\", \"heading\": \"Amiri\"}', NULL, 1, 1, 1, 0, 1, 4, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `themes` VALUES (5, 'Adat Jawa', 'adat-jawa', '/themes/adat-jawa/the-wedding.png', NULL, 'islamic', '{\"bg\": \"#FFF9F0\", \"text\": \"#2D2D2D\", \"accent\": \"#DAA520\", \"primary\": \"#C5963B\", \"secondary\": \"#8B6914\"}', '{\"body\": \"Poppins\", \"script\": \"Great Vibes\", \"heading\": \"Cinzel\"}', NULL, 1, 0, 0, 1, 1, 10, '2026-03-08 16:28:42', '2026-03-08 16:28:42');
INSERT INTO `themes` VALUES (6, 'Adat Sunda', 'adat-sunda', '/themes/adat-sunda/the-wedding.png', NULL, 'traditional', '{\"bg\": \"#FFF8F0\", \"text\": \"#2D2D2D\", \"accent\": \"#DAA520\", \"primary\": \"#1B6B3A\", \"secondary\": \"#C8A84E\"}', '{\"body\": \"Poppins\", \"script\": \"Great Vibes\", \"heading\": \"Cinzel\"}', NULL, 1, 1, 1, 1, 1, 6, '2026-03-09 13:15:17', '2026-03-09 13:15:17');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `avatar` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `role` enum('admin','user') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `onboarding_step` tinyint NOT NULL DEFAULT 0 COMMENT '0=belum mulai, 1=verification, 2=link, 3=profile, 4=events, 5=template, 6=selesai',
  `locale` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'id' COMMENT 'id, en',
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `otp_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `otp_expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `users_email_unique`(`email` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'Administrator', 'admin@groovy.com', '2026-03-08 15:24:46', '$2y$12$UXdJYX31HR0ka8.8EGKQZu5sAsrhrE/jCXofJF9TlkEC1fhSu0/Fq', NULL, NULL, 'admin', 1, 6, 'id', 'wUaY3KpIaTr2WbqI07dI0NSrz0se4FnROZpGJPQFlpx4mejMn26Ljgv2QKOy', NULL, NULL, '2026-03-08 15:24:46', '2026-03-08 15:24:46');
INSERT INTO `users` VALUES (2, 'Mira Rahayu', 'mira@test.com', '2026-03-08 15:24:47', '$2y$12$NGRJ2ZvX1BKKxWKl939nkuy2PTslg3H7vd5q4MQ8okF1qw5AIZz5O', '081234567890', NULL, 'user', 1, 6, 'id', 'TISMXyOeF4ITC700tPQkCWQvIflf1yJ297Mr6lmGyHdby1DcC9gzP5fQWjFn', NULL, NULL, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `users` VALUES (3, 'Andi Setiawan', 'andi@test.com', '2026-03-08 15:24:48', '$2y$12$8l4Wm82UnET27PIVt6Y3Se/eSJ9bLw32zhYoyrrrM3iK112DaElcm', '089876543210', NULL, 'user', 1, 6, 'id', NULL, NULL, NULL, '2026-03-08 15:24:48', '2026-03-08 15:24:48');
INSERT INTO `users` VALUES (4, 'M. Akrom Adabi', 'oke@gmail.com', NULL, '$2y$12$tGhFh0Bt3ABmQAV5vp1bJOCUPuK4Q7G7ifMt77cTnIhS2GspNgROW', NULL, NULL, 'user', 1, 0, 'id', NULL, NULL, NULL, '2026-03-09 14:54:51', '2026-03-09 17:05:11');
INSERT INTO `users` VALUES (5, 'bella', 'salsaviabella@gmail.com', '2026-03-09 17:40:57', '$2y$12$g.j8r8zzmHGJpbWyHpCGuuLOL5fpOW95OSBWLLKo6KQBOuJhEN0RC', '083132211830', NULL, 'user', 1, 6, 'id', NULL, NULL, NULL, '2026-03-09 17:17:31', '2026-03-09 17:45:04');

-- ----------------------------
-- Table structure for whatsapp_logs
-- ----------------------------
DROP TABLE IF EXISTS `whatsapp_logs`;
CREATE TABLE `whatsapp_logs`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `invitation_id` bigint UNSIGNED NOT NULL,
  `guest_id` bigint UNSIGNED NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','sent','failed','delivered') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `response` json NULL,
  `sent_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `whatsapp_logs_invitation_id_foreign`(`invitation_id` ASC) USING BTREE,
  INDEX `whatsapp_logs_guest_id_foreign`(`guest_id` ASC) USING BTREE,
  CONSTRAINT `whatsapp_logs_guest_id_foreign` FOREIGN KEY (`guest_id`) REFERENCES `guests` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `whatsapp_logs_invitation_id_foreign` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of whatsapp_logs
-- ----------------------------

-- ----------------------------
-- Table structure for wishes
-- ----------------------------
DROP TABLE IF EXISTS `wishes`;
CREATE TABLE `wishes`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `invitation_id` bigint UNSIGNED NOT NULL,
  `guest_id` bigint UNSIGNED NULL DEFAULT NULL,
  `sender_name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_visible` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `wishes_invitation_id_foreign`(`invitation_id` ASC) USING BTREE,
  INDEX `wishes_guest_id_foreign`(`guest_id` ASC) USING BTREE,
  CONSTRAINT `wishes_guest_id_foreign` FOREIGN KEY (`guest_id`) REFERENCES `guests` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  CONSTRAINT `wishes_invitation_id_foreign` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of wishes
-- ----------------------------
INSERT INTO `wishes` VALUES (1, 1, 1, 'Ahmad Fadhil', 'Barakallahu lakuma wa baraka alaikuma. Semoga menjadi keluarga sakinah mawaddah wa rahmah! 🤲', 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `wishes` VALUES (2, 1, 2, 'Siti Aisyah', 'Selamat menempuh hidup baru! Semoga bahagia selalu ya Mira & Randi 💕', 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `wishes` VALUES (3, 1, 5, 'Eko Prasetyo', 'Bro Randi, akhirnya nyusul juga! 😆 Happy wedding bro, semoga langgeng!', 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `wishes` VALUES (4, 1, 6, 'Fitri Handayani', 'Miraaaa! Akhirnya! 🥺🎉 Semoga pernikahan kalian penuh keberkahan. Love you!', 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');
INSERT INTO `wishes` VALUES (5, 1, NULL, 'Tamu Tidak Dikenal', 'Selamat menikah! Semoga bahagia 🎊', 1, '2026-03-08 15:24:47', '2026-03-08 15:24:47');

SET FOREIGN_KEY_CHECKS = 1;
