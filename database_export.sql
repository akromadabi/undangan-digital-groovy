-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: localhost    Database: undangan_digital
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bank_accounts`
--

DROP TABLE IF EXISTS `bank_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bank_accounts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `invitation_id` bigint unsigned NOT NULL,
  `bank_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'BCA, Mandiri, GoPay, OVO, Dana',
  `account_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bank_logo` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `bank_accounts_invitation_id_foreign` (`invitation_id`),
  CONSTRAINT `bank_accounts_invitation_id_foreign` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bank_accounts`
--

LOCK TABLES `bank_accounts` WRITE;
/*!40000 ALTER TABLE `bank_accounts` DISABLE KEYS */;
INSERT INTO `bank_accounts` VALUES (46,1,'BCA','Bimo Wicaksono','1234567890',NULL,0,'2026-05-23 08:37:48','2026-05-23 08:37:48'),(47,1,'Mandiri','Raras Sekar Ayu','0987654321',NULL,1,'2026-05-23 08:37:48','2026-05-23 08:37:48');
/*!40000 ALTER TABLE `bank_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bride_grooms`
--

DROP TABLE IF EXISTS `bride_grooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bride_grooms` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `invitation_id` bigint unsigned NOT NULL,
  `order_number` tinyint NOT NULL COMMENT '1=mempelai 1, 2=mempelai 2',
  `full_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nickname` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `father_name` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mother_name` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` enum('pria','wanita') COLLATE utf8mb4_unicode_ci NOT NULL,
  `photo` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `instagram` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tiktok` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `twitter` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `facebook` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `child_order` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Putra/Putri ke-berapa',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `bride_grooms_invitation_id_foreign` (`invitation_id`),
  CONSTRAINT `bride_grooms_invitation_id_foreign` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bride_grooms`
--

LOCK TABLES `bride_grooms` WRITE;
/*!40000 ALTER TABLE `bride_grooms` DISABLE KEYS */;
INSERT INTO `bride_grooms` VALUES (3,2,1,'Sari Puspita','Sari','Pak Hendra','Bu Yanti','wanita',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-08 08:24:48','2026-03-08 08:24:48'),(4,2,2,'Andi Setiawan','Andi','Pak Dedi','Bu Rina','pria',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-08 08:24:48','2026-03-08 08:24:48'),(7,3,1,'nama pria','panggilan pria','ayah pria','ibu pria','pria',NULL,'bio pria',NULL,NULL,NULL,NULL,NULL,'2026-03-09 10:43:31','2026-03-09 10:43:31'),(8,3,2,'nama wanita','panggilan wanita','nama ayah','nama ibu','wanita',NULL,'bio wanita',NULL,NULL,NULL,NULL,NULL,'2026-03-09 10:43:31','2026-03-09 10:43:31'),(9,4,1,'Romeo Montague','Romeo','Bpk. Montague','Ibu Montague','pria',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-18 12:47:19','2026-03-18 12:47:19'),(10,4,2,'Juliet Capulet','Juliet','Bpk. Capulet','Ibu Capulet','wanita',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-18 12:47:19','2026-03-18 12:47:19'),(11,5,1,'Romeo Montague','Romeo','Bpk. Montague','Ibu Montague','pria',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-18 12:47:19','2026-03-18 12:47:19'),(12,5,2,'Juliet Capulet','Juliet','Bpk. Capulet','Ibu Capulet','wanita',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-18 12:47:19','2026-03-18 12:47:19'),(13,6,1,'Romeo Montague','Romeo','Bpk. Montague','Ibu Montague','pria',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-18 12:47:20','2026-03-18 12:47:20'),(14,6,2,'Juliet Capulet','Juliet','Bpk. Capulet','Ibu Capulet','wanita',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-18 12:47:20','2026-03-18 12:47:20'),(15,7,1,'Romeo Montague','Romeo','Bpk. Montague','Ibu Montague','pria',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-18 12:47:20','2026-03-18 12:47:20'),(16,7,2,'Juliet Capulet','Juliet','Bpk. Capulet','Ibu Capulet','wanita',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-18 12:47:20','2026-03-18 12:47:20'),(17,8,1,'Romeo Montague','Romeo','Bpk. Montague','Ibu Montague','pria',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-18 12:47:20','2026-03-18 12:47:20'),(18,8,2,'Juliet Capulet','Juliet','Bpk. Capulet','Ibu Capulet','wanita',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-18 12:47:20','2026-03-18 12:47:20'),(19,9,1,'Romeo Montague','Romeo','Bpk. Montague','Ibu Montague','pria',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-18 12:47:20','2026-03-18 12:47:20'),(20,9,2,'Juliet Capulet','Juliet','Bpk. Capulet','Ibu Capulet','wanita',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-18 12:47:20','2026-03-18 12:47:20'),(21,10,1,'Romeo Montague','Romeo','Bpk. Montague','Ibu Montague','pria',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-18 12:47:20','2026-03-18 12:47:20'),(22,10,2,'Juliet Capulet','Juliet','Bpk. Capulet','Ibu Capulet','wanita',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-18 12:47:20','2026-03-18 12:47:20'),(23,11,1,'Romeo Montague','Romeo','Bpk. Montague','Ibu Montague','pria',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-18 12:47:20','2026-03-18 12:47:20'),(24,11,2,'Juliet Capulet','Juliet','Bpk. Capulet','Ibu Capulet','wanita',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-18 12:47:20','2026-03-18 12:47:20'),(61,1,1,'Bimo Wicaksono','Bimo','H. Joko Wicaksono','Hj. Endang Sri Lestari','pria','/themes/wayang/asset/jawa-hitam-p-e1760493392899.jpg','','USERNAME',NULL,NULL,NULL,'Pertama','2026-05-23 08:37:48','2026-05-23 08:37:48'),(62,1,2,'Raras Sekar Ayu','Raras','H. Bambang Sunarto','Hj. Wahyu Ningsih','wanita','/themes/wayang/asset/jawa-hitam-w.jpg','','USERNAME',NULL,NULL,NULL,'Kedua','2026-05-23 08:37:48','2026-05-23 08:37:48');
/*!40000 ALTER TABLE `bride_grooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
INSERT INTO `cache` VALUES ('undangan-digital-groovy-cache-like_theme_1_127.0.0.1','i:1;',1774031624),('undangan-digital-groovy-cache-like_theme_1_127.0.0.1:timer','i:1774031624;',1774031624),('undangan-digital-groovy-cache-like_theme_2_127.0.0.1','i:5;',1774031625),('undangan-digital-groovy-cache-like_theme_2_127.0.0.1:timer','i:1774031625;',1774031625),('undangan-digital-groovy-cache-like_theme_3_127.0.0.1','i:2;',1774031674),('undangan-digital-groovy-cache-like_theme_3_127.0.0.1:timer','i:1774031674;',1774031674),('undangan-digital-groovy-cache-oke@gmail.com|127.0.0.1','i:2;',1773867629),('undangan-digital-groovy-cache-oke@gmail.com|127.0.0.1:timer','i:1773867629;',1773867629);
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `invitation_id` bigint unsigned NOT NULL,
  `event_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'akad, pemberkatan, resepsi, lainnya',
  `event_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timezone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'WIB',
  `venue_name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `venue_address` text COLLATE utf8mb4_unicode_ci,
  `gmaps_link` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gmaps_embed` text COLLATE utf8mb4_unicode_ci COMMENT 'iframe embed google maps',
  `sort_order` tinyint NOT NULL DEFAULT '0',
  `is_primary` tinyint(1) NOT NULL DEFAULT '0',
  `streaming_platform` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `streaming_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `streamings` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `events_invitation_id_foreign` (`invitation_id`),
  CONSTRAINT `events_invitation_id_foreign` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (5,3,'akad','Akad Nikah','2026-03-11','02:43:00','04:44:00','WIB','Aula','alamat',NULL,NULL,0,0,NULL,NULL,NULL,'2026-03-09 10:44:59','2026-03-09 10:44:59'),(10,4,'Resepsi','Resepsi Pernikahan','2026-12-12','10:00:00','13:00:00','WIB','Gedung Pernikahan Impian','Jl. Kebahagiaan No. 1, Jakarta',NULL,NULL,0,1,NULL,NULL,NULL,'2026-03-18 12:47:19','2026-03-18 12:47:19'),(11,5,'Resepsi','Resepsi Pernikahan','2026-12-12','10:00:00','13:00:00','WIB','Gedung Pernikahan Impian','Jl. Kebahagiaan No. 1, Jakarta',NULL,NULL,0,1,NULL,NULL,NULL,'2026-03-18 12:47:19','2026-03-18 12:47:19'),(12,6,'Resepsi','Resepsi Pernikahan','2026-12-12','10:00:00','13:00:00','WIB','Gedung Pernikahan Impian','Jl. Kebahagiaan No. 1, Jakarta',NULL,NULL,0,1,NULL,NULL,NULL,'2026-03-18 12:47:20','2026-03-18 12:47:20'),(13,7,'Resepsi','Resepsi Pernikahan','2026-12-12','10:00:00','13:00:00','WIB','Gedung Pernikahan Impian','Jl. Kebahagiaan No. 1, Jakarta',NULL,NULL,0,1,NULL,NULL,NULL,'2026-03-18 12:47:20','2026-03-18 12:47:20'),(14,8,'Resepsi','Resepsi Pernikahan','2026-12-12','10:00:00','13:00:00','WIB','Gedung Pernikahan Impian','Jl. Kebahagiaan No. 1, Jakarta',NULL,NULL,0,1,NULL,NULL,NULL,'2026-03-18 12:47:20','2026-03-18 12:47:20'),(15,9,'Resepsi','Resepsi Pernikahan','2026-12-12','10:00:00','13:00:00','WIB','Gedung Pernikahan Impian','Jl. Kebahagiaan No. 1, Jakarta',NULL,NULL,0,1,NULL,NULL,NULL,'2026-03-18 12:47:20','2026-03-18 12:47:20'),(16,10,'Resepsi','Resepsi Pernikahan','2026-12-12','10:00:00','13:00:00','WIB','Gedung Pernikahan Impian','Jl. Kebahagiaan No. 1, Jakarta',NULL,NULL,0,1,NULL,NULL,NULL,'2026-03-18 12:47:20','2026-03-18 12:47:20'),(17,11,'Resepsi','Resepsi Pernikahan','2026-12-12','10:00:00','13:00:00','WIB','Gedung Pernikahan Impian','Jl. Kebahagiaan No. 1, Jakarta',NULL,NULL,0,1,NULL,NULL,NULL,'2026-03-18 12:47:20','2026-03-18 12:47:20'),(69,1,'akad','Akad Nikah','2026-12-25','08:00:00','10:00','WIB','Gedung Kesenian Jogja','Jl. Panembahan Senopati No. 2, Yogyakarta','https://maps.google.com/?q=Gedung+Kesenian+Yogyakarta',NULL,0,1,NULL,NULL,NULL,'2026-05-23 08:37:48','2026-05-23 08:37:48'),(70,1,'resepsi','Resepsi Pernikahan','2026-12-25','11:00:00','14:00','WIB','Gedung Kesenian Jogja','Jl. Panembahan Senopati No. 2, Yogyakarta','https://maps.google.com/?q=Gedung+Kesenian+Yogyakarta',NULL,1,0,NULL,NULL,NULL,'2026-05-23 08:37:48','2026-05-23 08:37:48');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `features`
--

DROP TABLE IF EXISTS `features`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `features` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` enum('content','settings','other') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'content',
  `description` text COLLATE utf8mb4_unicode_ci,
  `icon` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `features_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `features`
--

LOCK TABLES `features` WRITE;
/*!40000 ALTER TABLE `features` DISABLE KEYS */;
INSERT INTO `features` VALUES (1,'Opening','opening','content',NULL,'MdOutlineWavingHand','2026-03-08 08:24:46','2026-03-08 08:24:46'),(2,'Mempelai','bride_groom','content',NULL,'MdPeople','2026-03-08 08:24:46','2026-03-08 08:24:46'),(3,'Acara','event','content',NULL,'MdEvent','2026-03-08 08:24:46','2026-03-08 08:24:46'),(4,'Galeri','gallery','content',NULL,'MdPhotoLibrary','2026-03-08 08:24:46','2026-03-08 08:24:46'),(5,'Cerita Kami','love_story','content',NULL,'MdFavorite','2026-03-08 08:24:46','2026-03-08 08:24:46'),(6,'Bank / E-Wallet','bank','content',NULL,'MdAccountBalance','2026-03-08 08:24:46','2026-03-08 08:24:46'),(7,'Penutup','closing','content',NULL,'MdFlag','2026-03-08 08:24:46','2026-03-08 08:24:46'),(8,'Guestbook','guestbook','content',NULL,'MdMenuBook','2026-03-08 08:24:46','2026-03-08 08:24:46'),(9,'Save The Date','save_the_date','content',NULL,'MdCalendarToday','2026-03-08 08:24:46','2026-03-08 08:24:46'),(10,'Turut Mengundang','turut_mengundang','content',NULL,'MdGroups','2026-03-08 08:24:46','2026-03-08 08:24:46'),(11,'BrideGroom Detail','bride_groom_detail','content',NULL,'MdPersonPin','2026-03-08 08:24:46','2026-03-08 08:24:46'),(12,'Cover','cover','settings',NULL,'MdImage','2026-03-08 08:24:46','2026-03-08 08:24:46'),(13,'Tamu','guest','settings',NULL,'MdPersonAdd','2026-03-08 08:24:46','2026-03-08 08:24:46'),(14,'RSVP','rsvp','settings',NULL,'MdFactCheck','2026-03-08 08:24:46','2026-03-08 08:24:46'),(15,'Musik','music','settings',NULL,'MdMusicNote','2026-03-08 08:24:46','2026-03-08 08:24:46'),(16,'Hadiah','gift','settings',NULL,'MdCardGiftcard','2026-03-08 08:24:46','2026-03-08 08:24:46'),(17,'Kirim WhatsApp','whatsapp','settings',NULL,'MdWhatsapp','2026-03-08 08:24:46','2026-03-08 08:24:46'),(18,'Template','template','settings',NULL,'MdPalette','2026-03-08 08:24:46','2026-03-08 08:24:46'),(19,'Animasi','animasi','settings','Akses ke pengaturan animasi dan transisi tema',NULL,'2026-03-19 12:04:13','2026-03-19 12:04:13'),(20,'QR Code','qr_code','other','Fitur QR code untuk tamu undangan',NULL,'2026-03-19 12:04:13','2026-03-19 12:04:13'),(22,'Layar Sapa','layar_sapa','settings','Layar sambutan sebelum masuk ke undangan',NULL,'2026-03-19 12:04:13','2026-03-19 12:04:13');
/*!40000 ALTER TABLE `features` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `galleries`
--

DROP TABLE IF EXISTS `galleries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `galleries` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `invitation_id` bigint unsigned NOT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `caption` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `galleries_invitation_id_foreign` (`invitation_id`),
  CONSTRAINT `galleries_invitation_id_foreign` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=110 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `galleries`
--

LOCK TABLES `galleries` WRITE;
/*!40000 ALTER TABLE `galleries` DISABLE KEYS */;
INSERT INTO `galleries` VALUES (108,1,'/themes/wayang/asset/Mini-1-1-2-1024x683.jpg','',0,'2026-05-23 08:37:48','2026-05-23 08:37:48'),(109,1,'/themes/wayang/asset/Mini-1-3-e1760494660200.jpg','',1,'2026-05-23 08:37:48','2026-05-23 08:37:48');
/*!40000 ALTER TABLE `galleries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `general_hosts`
--

DROP TABLE IF EXISTS `general_hosts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `general_hosts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `invitation_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `social_links` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `general_hosts_invitation_id_foreign` (`invitation_id`),
  CONSTRAINT `general_hosts_invitation_id_foreign` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `general_hosts`
--

LOCK TABLES `general_hosts` WRITE;
/*!40000 ALTER TABLE `general_hosts` DISABLE KEYS */;
/*!40000 ALTER TABLE `general_hosts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gifts`
--

DROP TABLE IF EXISTS `gifts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gifts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `invitation_id` bigint unsigned NOT NULL,
  `guest_id` bigint unsigned DEFAULT NULL,
  `sender_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gift_type` enum('transfer','barang') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'transfer',
  `amount` decimal(12,2) DEFAULT NULL,
  `item_name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `confirmed` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gifts_invitation_id_foreign` (`invitation_id`),
  KEY `gifts_guest_id_foreign` (`guest_id`),
  CONSTRAINT `gifts_guest_id_foreign` FOREIGN KEY (`guest_id`) REFERENCES `guests` (`id`) ON DELETE SET NULL,
  CONSTRAINT `gifts_invitation_id_foreign` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gifts`
--

LOCK TABLES `gifts` WRITE;
/*!40000 ALTER TABLE `gifts` DISABLE KEYS */;
/*!40000 ALTER TABLE `gifts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `global_settings`
--

DROP TABLE IF EXISTS `global_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `global_settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `setting_value` text COLLATE utf8mb4_unicode_ci,
  `setting_type` enum('string','number','boolean','json') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'string',
  `category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'payment, whatsapp, general, seo',
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `global_settings_setting_key_unique` (`setting_key`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `global_settings`
--

LOCK TABLES `global_settings` WRITE;
/*!40000 ALTER TABLE `global_settings` DISABLE KEYS */;
INSERT INTO `global_settings` VALUES (1,'site_name','Undangan Digital Groovy','string','general','Nama situs','2026-03-08 08:24:47','2026-03-20 04:45:03'),(2,'site_domain','groovy.com','string','general','Domain utama','2026-03-08 08:24:47','2026-03-20 04:45:03'),(3,'site_tagline','Buat Undangan Digital Premium dalam Hitungan Menit','string','general','Tagline situs','2026-03-08 08:24:47','2026-03-20 04:45:03'),(4,'default_locale','id','string','general','Bahasa default (id/en)','2026-03-08 08:24:47','2026-03-20 04:45:03'),(5,'xendit_mode','sandbox','string','payment','Mode: sandbox / production','2026-03-08 08:24:47','2026-03-20 04:45:03'),(6,'xendit_secret_key',NULL,'string','payment','Xendit Secret API Key','2026-03-08 08:24:47','2026-03-20 04:45:03'),(7,'xendit_webhook_token',NULL,'string','payment','Xendit Webhook Verification Token','2026-03-08 08:24:47','2026-03-20 04:45:03'),(8,'xendit_success_url','/dashboard?payment=success','string','payment','Redirect URL setelah bayar sukses','2026-03-08 08:24:47','2026-03-20 04:45:03'),(9,'xendit_failure_url','/dashboard?payment=failed','string','payment','Redirect URL setelah bayar gagal','2026-03-08 08:24:47','2026-03-20 04:45:03'),(10,'mpwav9_api_url','https://serverwa.hello-inv.com/send-message','string','whatsapp','URL API MP WA V9 (contoh: https://api.mpwav9.com)','2026-03-08 08:24:47','2026-03-20 04:45:03'),(11,'mpwav9_api_token','skXUxgVjmF0xPr5symXK5cOv0PBFHb','string','whatsapp','Token API MP WA V9','2026-03-08 08:24:47','2026-03-20 04:45:03'),(12,'mpwav9_device_id',NULL,'string','whatsapp','Device ID MP WA V9','2026-03-08 08:24:47','2026-03-20 04:45:03'),(13,'mpwav9_sender_number','6283132211830','string','whatsapp','Nomor pengirim WA','2026-03-08 08:24:47','2026-03-20 04:45:03'),(14,'footer_description',NULL,'string','Footer','Deskripsi footer website','2026-03-19 09:47:55','2026-03-20 04:45:03'),(15,'footer_phone',NULL,'string','Footer','Nomor telepon','2026-03-19 09:47:55','2026-03-20 04:45:03'),(16,'footer_email',NULL,'string','Footer','Alamat email','2026-03-19 09:47:55','2026-03-20 04:45:03'),(17,'footer_whatsapp',NULL,'string','Footer','Nomor WhatsApp (Cth: 62812...)','2026-03-19 09:47:55','2026-03-20 04:45:03'),(18,'footer_instagram',NULL,'string','Footer','Username Instagram (Cth: @username)','2026-03-19 09:47:55','2026-03-20 04:45:03'),(19,'footer_tiktok',NULL,'string','Footer','Username TikTok (Cth: @username)','2026-03-19 09:47:55','2026-03-20 04:45:03'),(20,'footer_address',NULL,'string','Footer','Alamat lengkap perusahaan','2026-03-19 09:47:55','2026-03-20 04:45:03'),(24,'bank_accounts','[{\"bank_name\":\"BCA\",\"account_number\":\"1234567890\",\"account_name\":\"Nama Pemilik\"},{\"bank_name\":\"BRI\",\"account_number\":\"12309710294\",\"account_name\":\"ANDI\"}]','json','bank_transfer',NULL,'2026-03-20 03:51:05','2026-03-20 04:45:03');
/*!40000 ALTER TABLE `global_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guests`
--

DROP TABLE IF EXISTS `guests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guests` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `invitation_id` bigint unsigned NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'untuk URL unik: domain.com/u/slug?to=guest-slug',
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `group_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'kelompok: keluarga, teman, kantor',
  `max_pax` tinyint NOT NULL DEFAULT '2' COMMENT 'jumlah orang yang diundang',
  `wa_sent` tinyint(1) NOT NULL DEFAULT '0',
  `wa_sent_at` timestamp NULL DEFAULT NULL,
  `is_opened` tinyint(1) NOT NULL DEFAULT '0',
  `opened_at` timestamp NULL DEFAULT NULL,
  `checked_in` tinyint(1) NOT NULL DEFAULT '0',
  `checked_in_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `guests_invitation_id_slug_unique` (`invitation_id`,`slug`),
  CONSTRAINT `guests_invitation_id_foreign` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guests`
--

LOCK TABLES `guests` WRITE;
/*!40000 ALTER TABLE `guests` DISABLE KEYS */;
INSERT INTO `guests` VALUES (13,3,'Andi','8e8ms','797597',NULL,NULL,2,0,NULL,0,NULL,0,NULL,'2026-03-09 12:09:10','2026-03-09 12:09:10'),(64,1,'Ahmad Saputra','kpzeq','081122334455',NULL,'Keluarga',2,0,NULL,0,NULL,0,NULL,'2026-05-23 08:37:48','2026-05-23 08:37:48'),(65,1,'Siti Aminah','agmkm','082233445566',NULL,'Tetangga',2,0,NULL,0,NULL,0,NULL,'2026-05-23 08:37:48','2026-05-23 08:37:48');
/*!40000 ALTER TABLE `guests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invitation_sections`
--

DROP TABLE IF EXISTS `invitation_sections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invitation_sections` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `invitation_id` bigint unsigned NOT NULL,
  `section_key` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `section_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_visible` tinyint(1) NOT NULL DEFAULT '1',
  `custom_config` json DEFAULT NULL COMMENT 'override konfigurasi section',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `invitation_sections_invitation_id_section_key_unique` (`invitation_id`,`section_key`),
  CONSTRAINT `invitation_sections_invitation_id_foreign` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1118 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invitation_sections`
--

LOCK TABLES `invitation_sections` WRITE;
/*!40000 ALTER TABLE `invitation_sections` DISABLE KEYS */;
INSERT INTO `invitation_sections` VALUES (12,2,'cover','Cover',1,1,NULL,'2026-03-08 08:24:48','2026-05-22 09:22:39'),(13,2,'opening','Opening',2,1,NULL,'2026-03-08 08:24:48','2026-05-22 09:22:39'),(14,2,'bride_groom','Mempelai',3,1,NULL,'2026-03-08 08:24:48','2026-05-22 09:22:39'),(15,2,'event','Acara',6,1,NULL,'2026-03-08 08:24:48','2026-05-22 09:22:39'),(16,2,'countdown','Save The Date',4,1,NULL,'2026-03-08 08:24:48','2026-05-22 09:22:39'),(17,2,'gallery','Galeri',7,1,NULL,'2026-03-08 08:24:48','2026-05-22 09:22:39'),(18,2,'love_story','Kisah Cinta',5,1,NULL,'2026-03-08 08:24:48','2026-05-22 09:22:39'),(19,2,'bank','Amplop Digital',10,1,NULL,'2026-03-08 08:24:48','2026-05-22 09:22:39'),(20,2,'rsvp','RSVP',8,1,NULL,'2026-03-08 08:24:48','2026-05-22 09:22:39'),(21,2,'wishes','Ucapan',9,1,NULL,'2026-03-08 08:24:48','2026-05-22 09:22:39'),(22,2,'closing','Penutup',11,1,NULL,'2026-03-08 08:24:48','2026-05-22 09:22:39'),(76,3,'cover','Cover',1,1,NULL,'2026-03-09 10:45:04','2026-05-22 09:22:39'),(77,3,'opening','Opening',2,1,NULL,'2026-03-09 10:45:04','2026-05-22 09:22:39'),(78,3,'bride_groom','Mempelai',3,1,NULL,'2026-03-09 10:45:04','2026-05-22 09:22:39'),(79,3,'event','Acara',6,1,NULL,'2026-03-09 10:45:04','2026-05-22 09:22:39'),(80,3,'gallery','Galeri',7,1,NULL,'2026-03-09 10:45:04','2026-05-22 09:22:39'),(81,3,'love_story','Kisah Cinta',5,1,NULL,'2026-03-09 10:45:04','2026-05-22 09:22:39'),(82,3,'bank','Amplop Digital',10,1,NULL,'2026-03-09 10:45:04','2026-05-22 09:22:39'),(83,3,'rsvp','RSVP',8,1,NULL,'2026-03-09 10:45:04','2026-05-22 09:22:39'),(84,3,'wishes','Ucapan',9,1,NULL,'2026-03-09 10:45:04','2026-05-22 09:22:39'),(85,3,'closing','Penutup',11,1,NULL,'2026-03-09 10:45:04','2026-05-22 09:22:39'),(138,4,'cover','Cover',1,1,NULL,'2026-03-18 12:47:19','2026-05-22 09:22:39'),(139,4,'opening','Opening',2,1,NULL,'2026-03-18 12:47:19','2026-05-22 09:22:39'),(140,4,'bride_groom','Mempelai',3,1,NULL,'2026-03-18 12:47:19','2026-05-22 09:22:39'),(141,4,'event','Acara',6,1,NULL,'2026-03-18 12:47:19','2026-05-22 09:22:39'),(142,4,'countdown','Save The Date',4,1,NULL,'2026-03-18 12:47:19','2026-05-22 09:22:39'),(143,4,'gallery','Galeri',7,1,NULL,'2026-03-18 12:47:19','2026-05-22 09:22:39'),(144,4,'love_story','Kisah Cinta',5,1,NULL,'2026-03-18 12:47:19','2026-05-22 09:22:39'),(145,4,'bank','Amplop Digital',10,1,NULL,'2026-03-18 12:47:19','2026-05-22 09:22:39'),(146,4,'rsvp','RSVP',8,1,NULL,'2026-03-18 12:47:19','2026-05-22 09:22:39'),(147,4,'wishes','Ucapan',9,1,NULL,'2026-03-18 12:47:19','2026-05-22 09:22:39'),(148,4,'closing','Penutup',11,1,NULL,'2026-03-18 12:47:19','2026-05-22 09:22:39'),(149,5,'cover','Cover',1,1,NULL,'2026-03-18 12:47:19','2026-05-22 09:22:39'),(150,5,'opening','Opening',2,1,NULL,'2026-03-18 12:47:19','2026-05-22 09:22:39'),(151,5,'bride_groom','Mempelai',3,1,NULL,'2026-03-18 12:47:19','2026-05-22 09:22:39'),(152,5,'event','Acara',6,1,NULL,'2026-03-18 12:47:19','2026-05-22 09:22:39'),(153,5,'countdown','Save The Date',4,1,NULL,'2026-03-18 12:47:19','2026-05-22 09:22:39'),(154,5,'gallery','Galeri',7,1,NULL,'2026-03-18 12:47:19','2026-05-22 09:22:39'),(155,5,'love_story','Kisah Cinta',5,1,NULL,'2026-03-18 12:47:19','2026-05-22 09:22:39'),(156,5,'bank','Amplop Digital',10,1,NULL,'2026-03-18 12:47:19','2026-05-22 09:22:39'),(157,5,'rsvp','RSVP',8,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(158,5,'wishes','Ucapan',9,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(159,5,'closing','Penutup',11,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(160,6,'cover','Cover',1,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(161,6,'opening','Opening',2,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(162,6,'bride_groom','Mempelai',3,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(163,6,'event','Acara',6,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(164,6,'countdown','Save The Date',4,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(165,6,'gallery','Galeri',7,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(166,6,'love_story','Kisah Cinta',5,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(167,6,'bank','Amplop Digital',10,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(168,6,'rsvp','RSVP',8,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(169,6,'wishes','Ucapan',9,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(170,6,'closing','Penutup',11,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(171,7,'cover','Cover',1,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(172,7,'opening','Opening',2,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(173,7,'bride_groom','Mempelai',3,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(174,7,'event','Acara',6,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(175,7,'countdown','Save The Date',4,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(176,7,'gallery','Galeri',7,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(177,7,'love_story','Kisah Cinta',5,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(178,7,'bank','Amplop Digital',10,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(179,7,'rsvp','RSVP',8,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(180,7,'wishes','Ucapan',9,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(181,7,'closing','Penutup',11,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(182,8,'cover','Cover',1,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(183,8,'opening','Opening',2,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(184,8,'bride_groom','Mempelai',3,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(185,8,'event','Acara',6,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(186,8,'gallery','Galeri',7,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(187,8,'love_story','Kisah Cinta',5,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(188,8,'bank','Amplop Digital',10,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(189,8,'rsvp','RSVP',8,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(190,8,'wishes','Ucapan',9,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(191,8,'closing','Penutup',11,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(192,9,'cover','Cover',1,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(193,9,'opening','Opening',2,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(194,9,'bride_groom','Mempelai',3,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(195,9,'event','Acara',6,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(196,9,'countdown','Save The Date',4,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(197,9,'gallery','Galeri',7,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(198,9,'love_story','Kisah Cinta',5,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(199,9,'bank','Amplop Digital',10,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(200,9,'rsvp','RSVP',8,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(201,9,'wishes','Ucapan',9,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(202,9,'closing','Penutup',11,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(203,10,'cover','Cover',1,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(204,10,'opening','Opening',2,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(205,10,'bride_groom','Mempelai',3,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(206,10,'event','Acara',6,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(207,10,'countdown','Save The Date',4,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(208,10,'gallery','Galeri',7,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(209,10,'love_story','Kisah Cinta',5,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(210,10,'bank','Amplop Digital',10,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(211,10,'rsvp','RSVP',8,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(212,10,'wishes','Ucapan',9,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(213,10,'closing','Penutup',11,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(214,11,'cover','Cover',1,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(215,11,'opening','Opening',2,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(216,11,'bride_groom','Mempelai',3,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(217,11,'event','Acara',6,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(218,11,'countdown','Save The Date',4,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(219,11,'love_story','Kisah Cinta',5,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(220,11,'gallery','Galeri',7,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(221,11,'bank','Amplop Digital',10,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(222,11,'rsvp','RSVP',8,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(223,11,'wishes','Ucapan',9,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(224,11,'closing','Penutup',11,1,NULL,'2026-03-18 12:47:20','2026-05-22 09:22:39'),(1107,1,'cover','Cover',1,1,NULL,'2026-05-23 08:37:48','2026-05-23 08:37:48'),(1108,1,'opening','Opening',2,1,NULL,'2026-05-23 08:37:48','2026-05-23 08:37:48'),(1109,1,'bride_groom','Mempelai',3,1,NULL,'2026-05-23 08:37:48','2026-05-23 08:37:48'),(1110,1,'countdown','Save The Date',4,1,NULL,'2026-05-23 08:37:48','2026-05-23 08:37:48'),(1111,1,'love_story','Kisah Cinta',5,1,NULL,'2026-05-23 08:37:48','2026-05-23 08:37:48'),(1112,1,'event','Acara',6,1,NULL,'2026-05-23 08:37:48','2026-05-23 08:37:48'),(1113,1,'gallery','Galeri',7,1,NULL,'2026-05-23 08:37:48','2026-05-23 08:37:48'),(1114,1,'rsvp','RSVP',8,1,NULL,'2026-05-23 08:37:48','2026-05-23 08:37:48'),(1115,1,'wishes','Ucapan',9,1,NULL,'2026-05-23 08:37:48','2026-05-23 08:37:48'),(1116,1,'bank','Amplop Digital',10,1,NULL,'2026-05-23 08:37:48','2026-05-23 08:37:48'),(1117,1,'closing','Penutup',11,1,NULL,'2026-05-23 08:37:48','2026-05-23 08:37:48');
/*!40000 ALTER TABLE `invitation_sections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invitations`
--

DROP TABLE IF EXISTS `invitations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invitations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `theme_id` bigint unsigned DEFAULT NULL,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'URL: domain.com/u/{slug}',
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'wedding',
  `title` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `opening_title` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `opening_text` text COLLATE utf8mb4_unicode_ci,
  `opening_ayat` text COLLATE utf8mb4_unicode_ci COMMENT 'ayat/kutipan pembuka',
  `opening_ayat_translation` text COLLATE utf8mb4_unicode_ci,
  `opening_ayat_source` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `closing_title` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `closing_text` text COLLATE utf8mb4_unicode_ci,
  `cover_image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cover_title` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cover_subtitle` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `layout_mode` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'scroll',
  `menu_position` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'none',
  `custom_domain` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `show_side_menu` tinyint(1) NOT NULL DEFAULT '0',
  `particle_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `particle_count` int unsigned NOT NULL DEFAULT '30',
  `particle_speed` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'normal',
  `music_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `music_autoplay` tinyint(1) NOT NULL DEFAULT '1',
  `enable_auto_scroll` tinyint(1) NOT NULL DEFAULT '1',
  `save_the_date_enabled` tinyint(1) NOT NULL DEFAULT '0',
  `countdown_target_date` datetime DEFAULT NULL,
  `turut_mengundang_text` text COLLATE utf8mb4_unicode_ci,
  `is_published` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `show_photos` tinyint(1) NOT NULL DEFAULT '1',
  `show_animations` tinyint(1) NOT NULL DEFAULT '1',
  `show_guest_name` tinyint(1) NOT NULL DEFAULT '1',
  `show_countdown` tinyint(1) NOT NULL DEFAULT '1',
  `show_qr_code` tinyint(1) NOT NULL DEFAULT '0',
  `enable_rsvp` tinyint(1) NOT NULL DEFAULT '1',
  `enable_wishes` tinyint(1) NOT NULL DEFAULT '1',
  `language` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'id',
  `religion` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'islam',
  `is_private` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Tidak muncul di Google/landing',
  `enable_qr` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Tombol QR aktif di undangan',
  `hide_photos` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Mode tanpa foto',
  `gallery_mode` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'grid' COMMENT 'grid, carousel, slide',
  `live_delay` tinyint unsigned NOT NULL DEFAULT '3' COMMENT 'seconds delay for name display',
  `live_counter` tinyint(1) NOT NULL DEFAULT '1',
  `live_template` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'elegant' COMMENT 'elegant, celebration',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `invitations_slug_unique` (`slug`),
  UNIQUE KEY `invitations_custom_domain_unique` (`custom_domain`),
  KEY `invitations_user_id_foreign` (`user_id`),
  KEY `invitations_theme_id_foreign` (`theme_id`),
  CONSTRAINT `invitations_theme_id_foreign` FOREIGN KEY (`theme_id`) REFERENCES `themes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `invitations_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invitations`
--

LOCK TABLES `invitations` WRITE;
/*!40000 ALTER TABLE `invitations` DISABLE KEYS */;
INSERT INTO `invitations` VALUES (1,2,18,'mira-randi','wedding','Pernikahan Mira & Randi','The Wedding Of','Assalamu\'alaikum Warahmatullahi Wabarakatuh\n\nDengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan kami.','Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah).','Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah).','Adz-Dzariyat: 49','THANK YOU','Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu, Saudara/i berkenan hadir di hari bahagia kami.','/storage/covers/fI2Wm0s2Nj8dGeFsKKLvoFQFh0hhBZFww0rhdqAA.webp','Bimo & Raras','Kami mengundang Anda untuk menghadiri acara pernikahan kami.','scroll','bottom',NULL,0,'gold-dust',30,'normal','/audio/backsound.mp3',1,1,1,'2026-12-25 08:00:00','',0,1,1,1,1,1,1,1,1,'en','islam',0,1,0,'grid',3,1,'celebration','2026-03-08 08:24:47','2026-05-23 08:37:48'),(2,3,5,'andi-sari','wedding','Pernikahan Andi & Sari','Bismillah','Dengan memohon ridho Allah SWT, kami mengundang Anda.',NULL,NULL,NULL,'Terima Kasih','Terima kasih atas doa dan kehadirannya.',NULL,'The Wedding Of','Andi & Sari','scroll','none',NULL,0,NULL,30,'normal',NULL,1,1,0,NULL,NULL,0,1,1,1,1,1,1,1,1,'id','islam',0,1,0,'grid',3,1,'elegant','2026-03-08 08:24:48','2026-05-22 20:52:10'),(3,5,5,'andi','wedding',NULL,'Bismillahirrahmanirrahim','Assalamu\'alaikum Warahmatullahi Wabarakatuh\n\nDengan memohon Rahmat dan Ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan putra-putri kami.','وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'scroll','none',NULL,0,NULL,30,'normal',NULL,1,1,0,NULL,NULL,0,1,1,0,1,1,1,1,1,'en','islam',0,1,0,'grid',3,1,'elegant','2026-03-09 10:42:06','2026-03-09 11:59:59'),(4,8,5,'demo-elegant-rose','wedding',NULL,'The Wedding Of','Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.','وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',NULL,NULL,NULL,'Atas kehadiran dan doa restunya, kami mengucapkan terima kasih.',NULL,'Romeo & Juliet','Minggu, 12 Desember 2026','scroll','none',NULL,0,NULL,30,'normal',NULL,1,1,0,NULL,NULL,0,1,1,1,1,1,1,1,1,'id','islam',0,1,0,'grid',3,1,'elegant','2026-03-18 12:47:19','2026-05-22 20:52:10'),(5,8,5,'demo-garden-navy','wedding',NULL,'The Wedding Of','Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.','وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',NULL,NULL,NULL,'Atas kehadiran dan doa restunya, kami mengucapkan terima kasih.',NULL,'Romeo & Juliet','Minggu, 12 Desember 2026','scroll','none',NULL,0,NULL,30,'normal',NULL,1,1,0,NULL,NULL,0,1,1,1,1,1,1,1,1,'id','islam',0,1,0,'grid',3,1,'elegant','2026-03-18 12:47:19','2026-05-22 20:52:10'),(6,8,5,'demo-modern-black','wedding',NULL,'The Wedding Of','Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.','وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',NULL,NULL,NULL,'Atas kehadiran dan doa restunya, kami mengucapkan terima kasih.',NULL,'Romeo & Juliet','Minggu, 12 Desember 2026','scroll','none',NULL,0,NULL,30,'normal',NULL,1,1,0,NULL,NULL,0,1,1,1,1,1,1,1,1,'id','islam',0,1,0,'grid',3,1,'elegant','2026-03-18 12:47:20','2026-05-22 20:52:10'),(7,8,5,'demo-islamic-green','wedding',NULL,'The Wedding Of','Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.','وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',NULL,NULL,NULL,'Atas kehadiran dan doa restunya, kami mengucapkan terima kasih.',NULL,'Romeo & Juliet','Minggu, 12 Desember 2026','scroll','none',NULL,0,NULL,30,'normal',NULL,1,1,0,NULL,NULL,0,1,1,1,1,1,1,1,1,'id','islam',0,1,0,'grid',3,1,'elegant','2026-03-18 12:47:20','2026-05-22 20:52:10'),(8,8,5,'demo-adat-jawa','wedding',NULL,'The Wedding Of','Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.','وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',NULL,NULL,NULL,'Atas kehadiran dan doa restunya, kami mengucapkan terima kasih.',NULL,'Romeo & Juliet','Minggu, 12 Desember 2026','scroll','none',NULL,0,NULL,30,'normal',NULL,1,1,0,NULL,NULL,0,1,1,1,1,1,1,1,1,'id','islam',0,1,0,'grid',3,1,'elegant','2026-03-18 12:47:20','2026-05-22 20:52:10'),(9,8,5,'demo-adat-sunda','wedding',NULL,'The Wedding Of','Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.','وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',NULL,NULL,NULL,'Atas kehadiran dan doa restunya, kami mengucapkan terima kasih.',NULL,'Romeo & Juliet','Minggu, 12 Desember 2026','scroll','none',NULL,0,NULL,30,'normal',NULL,1,1,0,NULL,NULL,0,1,1,1,1,1,1,1,1,'id','islam',0,1,0,'grid',3,1,'elegant','2026-03-18 12:47:20','2026-05-22 20:52:10'),(10,8,5,'demo-heritage','wedding',NULL,'The Wedding Of','Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.','وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',NULL,NULL,NULL,'Atas kehadiran dan doa restunya, kami mengucapkan terima kasih.',NULL,'Romeo & Juliet','Minggu, 12 Desember 2026','scroll','none',NULL,0,NULL,30,'normal',NULL,1,1,0,NULL,NULL,0,1,1,1,1,1,1,1,1,'id','islam',0,1,0,'grid',3,1,'elegant','2026-03-18 12:47:20','2026-05-22 20:52:10'),(11,8,5,'demo-spesial-02','wedding',NULL,'The Wedding Of','Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.','وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',NULL,NULL,NULL,'Atas kehadiran dan doa restunya, kami mengucapkan terima kasih.',NULL,'Romeo & Juliet','Minggu, 12 Desember 2026','scroll','none',NULL,0,NULL,30,'normal',NULL,1,1,0,NULL,NULL,0,1,1,1,1,1,1,1,1,'id','islam',0,1,0,'grid',3,1,'elegant','2026-03-18 12:47:20','2026-05-22 20:52:10');
/*!40000 ALTER TABLE `invitations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `love_stories`
--

DROP TABLE IF EXISTS `love_stories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `love_stories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `invitation_id` bigint unsigned NOT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `story_date` date DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `love_stories_invitation_id_foreign` (`invitation_id`),
  CONSTRAINT `love_stories_invitation_id_foreign` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `love_stories`
--

LOCK TABLES `love_stories` WRITE;
/*!40000 ALTER TABLE `love_stories` DISABLE KEYS */;
INSERT INTO `love_stories` VALUES (73,1,'Awal Bertemu',NULL,'Kami diperkenalkan oleh seorang sahabat di Yogyakarta pada akhir tahun 2023. Sejak pertemuan pertama itu, kami merasa memiliki kecocokan visi hidup yang sama.',NULL,0,'2026-05-23 08:37:48','2026-05-23 08:37:48'),(74,1,'Komitmen Bersama',NULL,'Setelah satu tahun menjalin komunikasi yang intens, kami sepakat untuk melangkah ke jenjang yang lebih serius dengan memohon restu kedua orang tua.',NULL,1,'2026-05-23 08:37:48','2026-05-23 08:37:48'),(75,1,'Khitbah (Lamaran)',NULL,'Pada pertengahan tahun 2025, Bimo bersama keluarga besar secara resmi datang meminang Raras di hadapan kedua orang tuanya.',NULL,2,'2026-05-23 08:37:48','2026-05-23 08:37:48');
/*!40000 ALTER TABLE `love_stories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2025_01_01_000001_create_subscription_plans_table',1),(5,'2025_01_01_000002_create_features_table',1),(6,'2025_01_01_000003_create_plan_feature_access_table',1),(7,'2025_01_01_000004_create_payments_table',1),(8,'2025_01_01_000005_create_subscriptions_table',1),(9,'2025_01_01_000006_create_themes_table',1),(10,'2025_01_01_000007_create_theme_sections_table',1),(11,'2025_01_01_000008_create_invitations_table',1),(12,'2025_01_01_000009_create_invitation_sections_table',1),(13,'2025_01_01_000010_create_bride_grooms_table',1),(14,'2025_01_01_000011_create_events_table',1),(15,'2025_01_01_000012_create_galleries_table',1),(16,'2025_01_01_000013_create_love_stories_table',1),(17,'2025_01_01_000014_create_bank_accounts_table',1),(18,'2025_01_01_000015_create_guests_table',1),(19,'2025_01_01_000016_create_rsvps_table',1),(20,'2025_01_01_000017_create_wishes_table',1),(21,'2025_01_01_000018_create_gifts_table',1),(22,'2025_01_01_000019_create_global_settings_table',1),(23,'2025_01_01_000020_create_whatsapp_logs_table',1),(24,'2025_03_09_000001_add_checkin_to_guests_table',2),(25,'2025_03_09_000002_add_privacy_to_invitations_table',3),(26,'2025_03_09_000003_add_gallery_mode_to_invitations_table',4),(27,'2025_03_09_000004_add_live_settings_to_invitations_table',5),(28,'2025_03_09_000005_create_music_library_table',6),(29,'2025_03_09_000006_add_adat_sunda_theme',7),(30,'2026_03_09_170918_add_otp_fields_to_users_table',8),(31,'2026_03_09_183221_add_settings_columns_to_invitations_table',9),(32,'2026_03_09_192047_add_show_side_menu_to_invitations_table',10),(33,'2026_03_11_000001_add_is_primary_to_events_table',11),(34,'2026_03_11_000002_add_streaming_to_events_table',12),(35,'2026_03_11_143130_add_streamings_json_to_events_table',13),(36,'2026_03_11_145842_add_religion_to_invitations_table',14),(37,'2026_03_11_145931_create_quote_templates_table',14),(38,'2026_03_11_152205_refactor_quote_templates_split_fields',15),(39,'2026_03_11_152210_add_ayat_fields_to_invitations_table',15),(40,'2026_03_12_000001_add_particle_fields_to_invitations_table',16),(41,'2026_03_12_000002_convert_layout_mode_values',17),(42,'2026_03_12_000003_change_layout_mode_to_string',18),(43,'2026_03_12_000004_add_menu_position_to_invitations',19),(44,'2026_03_13_000001_add_heritage_theme_sections',20),(45,'2026_03_13_000002_add_super_admin_role_and_reseller_fields',21),(46,'2026_03_13_000003_create_reseller_settings_table',21),(47,'2026_03_13_000004_create_reseller_plan_prices_table',21),(48,'2026_03_13_000005_create_reseller_wallets_table',22),(49,'2026_03_16_000001_create_withdrawals_table',23),(50,'2026_03_16_000002_add_bank_fields_to_reseller_settings',23),(51,'2026_03_16_000001_add_spesial_02_theme',24),(52,'2026_03_18_191835_add_normal_price_to_reseller_plan_prices',25),(53,'2026_03_18_201723_add_category_to_invitations_and_themes_table',26),(54,'2026_03_18_201725_create_general_hosts_table',26),(55,'2026_03_19_000001_update_kisah_cinta_labels',27),(57,'2026_03_19_000001_add_footer_fields_to_reseller_settings',28),(58,'2026_03_19_000002_seed_footer_global_settings',29),(59,'2026_03_19_182852_add_likes_to_themes_table',30),(60,'2026_03_20_000001_add_manual_payment_fields_to_payments',31),(61,'2026_03_20_000002_seed_bank_transfer_global_settings',32),(62,'2026_03_20_174640_modify_status_enum_on_payments_table',33),(63,'2026_03_20_175000_replace_old_bank_settings_with_bank_accounts',34),(64,'2026_03_20_185000_insert_elegant_01_theme_into_themes',35),(65,'2026_05_22_000001_add_default_data_to_themes_table',36),(66,'2026_05_22_074458_fix_layout_mode_column_for_sqlite',36),(67,'2026_05_22_123500_change_end_time_to_string_in_events_table',37),(68,'2026_05_23_000001_cleanup_themes_and_register_aruna',38),(69,'2026_05_23_000002_add_enable_auto_scroll_to_invitations_table',39),(70,'2026_05_23_143500_add_custom_domain_to_invitations_table',40);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `music_library`
--

DROP TABLE IF EXISTS `music_library`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `music_library` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `artist` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'romantis',
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'url',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `music_library`
--

LOCK TABLES `music_library` WRITE;
/*!40000 ALTER TABLE `music_library` DISABLE KEYS */;
INSERT INTO `music_library` VALUES (2,'Its You','Sezairi','romantis','/storage/music/gJsseddV6plRgCmYQRLqTW7WUP7fhCZUQNrVPw6B.mp3','upload',1,0,'2026-03-09 09:23:15','2026-03-09 09:23:15'),(3,'Nadlif Basalamah','Nadlif Basalamah','romantis','/storage/music/2HYRGURH14Poq7bpsMfxYOT7poMMrUGb7QRXRgMO.mp3','upload',1,0,'2026-03-09 09:24:42','2026-03-09 09:24:42'),(4,'Test Song','Test Artist','romantis','https://example.com/test.mp3','url',1,0,'2026-03-15 09:59:25','2026-03-15 09:59:25');
/*!40000 ALTER TABLE `music_library` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `plan_id` bigint unsigned NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `payment_method` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'bank_transfer, ewallet, qris',
  `payment_gateway` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'xendit',
  `gateway_order_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gateway_transaction_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `external_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('pending','paid','failed','refunded','expired','pending_manual','waiting_review','cancelled','rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `paid_at` timestamp NULL DEFAULT NULL,
  `metadata` json DEFAULT NULL COMMENT 'data tambahan dari gateway',
  `proof_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `admin_notes` text COLLATE utf8mb4_unicode_ci,
  `reviewed_by` bigint unsigned DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `payments_plan_id_foreign` (`plan_id`),
  KEY `payments_user_id_status_index` (`user_id`,`status`),
  KEY `payments_reviewed_by_foreign` (`reviewed_by`),
  CONSTRAINT `payments_plan_id_foreign` FOREIGN KEY (`plan_id`) REFERENCES `subscription_plans` (`id`),
  CONSTRAINT `payments_reviewed_by_foreign` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `payments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,2,3,99000.00,NULL,'xendit',NULL,NULL,NULL,'paid','2026-03-03 08:24:47',NULL,NULL,NULL,NULL,NULL,'2026-03-08 08:24:47','2026-03-08 08:24:47'),(2,5,2,49000.00,NULL,'xendit',NULL,NULL,NULL,'pending',NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-09 11:06:54','2026-03-09 11:06:54'),(3,3,3,120000.00,NULL,'xendit',NULL,NULL,NULL,'pending',NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-20 03:46:46','2026-03-20 03:46:46'),(4,3,2,50000.00,'bank_transfer','manual',NULL,NULL,NULL,'pending_manual',NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-20 04:45:17','2026-03-20 04:45:17'),(5,3,2,50000.00,NULL,'xendit',NULL,NULL,NULL,'pending',NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-20 04:46:12','2026-03-20 04:46:12');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plan_feature_access`
--

DROP TABLE IF EXISTS `plan_feature_access`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plan_feature_access` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `plan_id` bigint unsigned NOT NULL,
  `feature_id` bigint unsigned NOT NULL,
  `is_enabled` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `plan_feature_access_plan_id_feature_id_unique` (`plan_id`,`feature_id`),
  KEY `plan_feature_access_feature_id_foreign` (`feature_id`),
  CONSTRAINT `plan_feature_access_feature_id_foreign` FOREIGN KEY (`feature_id`) REFERENCES `features` (`id`) ON DELETE CASCADE,
  CONSTRAINT `plan_feature_access_plan_id_foreign` FOREIGN KEY (`plan_id`) REFERENCES `subscription_plans` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plan_feature_access`
--

LOCK TABLES `plan_feature_access` WRITE;
/*!40000 ALTER TABLE `plan_feature_access` DISABLE KEYS */;
INSERT INTO `plan_feature_access` VALUES (1,1,1,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(2,1,2,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(3,1,3,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(4,1,4,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(5,1,5,0,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(6,1,6,0,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(7,1,7,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(8,1,8,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(9,1,9,0,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(10,1,10,0,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(11,1,11,0,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(12,1,12,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(13,1,13,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(14,1,14,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(15,1,15,0,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(16,1,16,0,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(17,1,17,0,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(18,1,18,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(19,2,1,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(20,2,2,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(21,2,3,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(22,2,4,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(23,2,5,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(24,2,6,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(25,2,7,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(26,2,8,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(27,2,9,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(28,2,10,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(29,2,11,0,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(30,2,12,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(31,2,13,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(32,2,14,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(33,2,15,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(34,2,16,0,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(35,2,17,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(36,2,18,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(37,3,1,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(38,3,2,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(39,3,3,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(40,3,4,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(41,3,5,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(42,3,6,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(43,3,7,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(44,3,8,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(45,3,9,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(46,3,10,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(47,3,11,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(48,3,12,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(49,3,13,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(50,3,14,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(51,3,15,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(52,3,16,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(53,3,17,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(54,3,18,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(55,4,1,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(56,4,2,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(57,4,3,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(58,4,4,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(59,4,5,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(60,4,6,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(61,4,7,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(62,4,8,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(63,4,9,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(64,4,10,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(65,4,11,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(66,4,12,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(67,4,13,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(68,4,14,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(69,4,15,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(70,4,16,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(71,4,17,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(72,4,18,1,'2026-03-08 08:24:46','2026-03-08 08:24:46');
/*!40000 ALTER TABLE `plan_feature_access` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quote_templates`
--

DROP TABLE IF EXISTS `quote_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quote_templates` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `religion` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ayat` text COLLATE utf8mb4_unicode_ci,
  `translation` text COLLATE utf8mb4_unicode_ci,
  `source` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `quote_templates_religion_index` (`religion`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quote_templates`
--

LOCK TABLES `quote_templates` WRITE;
/*!40000 ALTER TABLE `quote_templates` DISABLE KEYS */;
INSERT INTO `quote_templates` VALUES (1,'islam','QS. Ar-Rum: 21','وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً','Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.','QS. Ar-Rum: 21',1,1,'2026-03-11 08:25:18','2026-03-11 08:25:18'),(2,'islam','QS. An-Nur: 32','وَأَنكِحُوا الْأَيَامَىٰ مِنكُمْ وَالصَّالِحِينَ مِنْ عِبَادِكُمْ وَإِمَائِكُمْ','Dan nikahkanlah orang-orang yang masih membujang di antara kamu, dan juga orang-orang yang layak (menikah) dari hamba-hamba sahayamu yang laki-laki dan perempuan.','QS. An-Nur: 32',2,1,'2026-03-11 08:25:18','2026-03-11 08:25:18'),(3,'islam','QS. Adz-Dzariyat: 49','وَمِن كُلِّ شَيْءٍ خَلَقْنَا زَوْجَيْنِ لَعَلَّكُمْ تَذَكَّرُونَ','Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah).','QS. Adz-Dzariyat: 49',3,1,'2026-03-11 08:25:18','2026-03-11 08:25:18'),(4,'islam','QS. Yasin: 36','سُبْحَانَ الَّذِي خَلَقَ الْأَزْوَاجَ كُلَّهَا مِمَّا تُنبِتُ الْأَرْضُ وَمِنْ أَنفُسِهِمْ وَمِمَّا لَا يَعْلَمُونَ','Maha Suci (Allah) yang telah menciptakan semuanya berpasang-pasangan, baik dari apa yang ditumbuhkan oleh bumi dan dari diri mereka sendiri, maupun dari apa yang tidak mereka ketahui.','QS. Yasin: 36',4,1,'2026-03-11 08:25:18','2026-03-11 08:25:18'),(5,'islam','QS. An-Nisa: 1','يَا أَيُّهَا النَّاسُ اتَّقُوا رَبَّكُمُ الَّذِي خَلَقَكُم مِّن نَّفْسٍ وَاحِدَةٍ وَخَلَقَ مِنْهَا زَوْجَهَا','Wahai manusia! Bertakwalah kepada Tuhanmu yang telah menciptakan kamu dari diri yang satu (Adam), dan (Allah) menciptakan pasangannya (Hawa) dari (diri)-nya.','QS. An-Nisa: 1',5,1,'2026-03-11 08:25:18','2026-03-11 08:25:18'),(6,'islam','QS. Al-Hujurat: 13','يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُم مِّن ذَكَرٍ وَأُنثَىٰ وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا','Wahai manusia! Sungguh, Kami telah menciptakan kamu dari seorang laki-laki dan seorang perempuan, kemudian Kami jadikan kamu berbangsa-bangsa dan bersuku-suku agar kamu saling mengenal.','QS. Al-Hujurat: 13',6,1,'2026-03-11 08:25:18','2026-03-11 08:25:18'),(7,'islam','QS. Al-A\'raf: 189','هُوَ الَّذِي خَلَقَكُم مِّن نَّفْسٍ وَاحِدَةٍ وَجَعَلَ مِنْهَا زَوْجَهَا لِيَسْكُنَ إِلَيْهَا','Dialah yang menciptakan kamu dari jiwa yang satu (Adam) dan darinya Dia menciptakan pasangannya, agar dia merasa senang kepadanya.','QS. Al-A\'raf: 189',7,1,'2026-03-11 08:25:18','2026-03-11 08:25:18'),(8,'islam','QS. Al-Furqan: 74','رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا','Ya Tuhan kami, anugerahkanlah kepada kami pasangan kami dan keturunan kami sebagai penyenang hati (kami), dan jadikanlah kami pemimpin bagi orang-orang yang bertakwa.','QS. Al-Furqan: 74',8,1,'2026-03-11 08:25:18','2026-03-11 08:25:18'),(9,'islam','QS. Ar-Ra\'d: 38','وَلَقَدْ أَرْسَلْنَا رُسُلًا مِّن قَبْلِكَ وَجَعَلْنَا لَهُمْ أَزْوَاجًا وَذُرِّيَّةً','Dan sungguh, Kami telah mengutus beberapa rasul sebelum engkau (Muhammad) dan Kami berikan kepada mereka istri-istri dan keturunan.','QS. Ar-Ra\'d: 38',9,1,'2026-03-11 08:25:18','2026-03-11 08:25:18'),(10,'islam','QS. At-Tahrim: 6','يَا أَيُّهَا الَّذِينَ آمَنُوا قُوا أَنفُسَكُمْ وَأَهْلِيكُمْ نَارًا','Wahai orang-orang yang beriman! Peliharalah dirimu dan keluargamu dari api neraka.','QS. At-Tahrim: 6',10,1,'2026-03-11 08:25:18','2026-03-11 08:25:18'),(11,'kristen','Kejadian 2:24','Sebab itu seorang laki-laki akan meninggalkan ayahnya dan ibunya dan bersatu dengan istrinya, sehingga keduanya menjadi satu daging.',NULL,'Kejadian 2:24',1,1,'2026-03-11 08:25:18','2026-03-11 08:25:18'),(12,'kristen','1 Korintus 13:4-7','Kasih itu sabar; kasih itu murah hati; ia tidak cemburu. Ia tidak memegahkan diri dan tidak sombong. Ia tidak melakukan yang tidak sopan dan tidak mencari keuntungan diri sendiri. Ia tidak pemarah dan tidak menyimpan kesalahan orang lain.',NULL,'1 Korintus 13:4-7',2,1,'2026-03-11 08:25:18','2026-03-11 08:25:18'),(13,'kristen','Pengkhotbah 4:9-12','Berdua lebih baik dari pada seorang diri, karena mereka menerima upah yang baik dalam jerih payah mereka. Karena kalau mereka jatuh, yang seorang mengangkat temannya.',NULL,'Pengkhotbah 4:9-12',3,1,'2026-03-11 08:25:18','2026-03-11 08:25:18'),(14,'kristen','Markus 10:9','Demikianlah mereka bukan lagi dua, melainkan satu. Karena itu, apa yang telah dipersatukan Allah, tidak boleh diceraikan manusia.',NULL,'Markus 10:9',4,1,'2026-03-11 08:25:18','2026-03-11 08:25:18'),(15,'kristen','Amsal 18:22','Siapa mendapat istri, mendapat sesuatu yang baik, dan ia dikenan TUHAN.',NULL,'Amsal 18:22',5,1,'2026-03-11 08:25:18','2026-03-11 08:25:18'),(16,'hindu','Manawa Dharmasastra IX.96','Untuk menjadi keturunan, untuk kebahagiaan, untuk melaksanakan upacara keagamaan, dan untuk memperoleh kesenangan tertinggi, seorang wanita diberikan kepada seorang pria.',NULL,'Manawa Dharmasastra IX.96',1,1,'2026-03-11 08:25:18','2026-03-11 08:25:18'),(17,'hindu','Rg Veda X.85.47','Semoga hari-hari yang datang membawa kebahagiaan bagi kalian berdua. Semoga kalian hidup di rumah yang penuh dengan kegembiraan dan anak-anak.',NULL,'Rg Veda X.85.47',2,1,'2026-03-11 08:25:18','2026-03-11 08:25:18'),(18,'hindu','Manawa Dharmasastra III.60','Di mana wanita dihormati, di sanalah para dewa merasa senang; tetapi di mana mereka tidak dihormati, tidak ada upacara suci yang akan membuahkan hasil.',NULL,'Manawa Dharmasastra III.60',3,1,'2026-03-11 08:25:18','2026-03-11 08:25:18'),(19,'hindu','Sarasamuccaya 23','Dharma adalah jalan hidup yang benar. Pernikahan adalah dharma yang suci, persatuan dua jiwa dalam cinta dan pengabdian.',NULL,'Sarasamuccaya 23',4,1,'2026-03-11 08:25:18','2026-03-11 08:25:18'),(20,'hindu','Manawa Dharmasastra IX.101','Suami dan istri yang saling setia akan senantiasa bersatu, baik di dunia ini maupun di dunia yang akan datang.',NULL,'Manawa Dharmasastra IX.101',5,1,'2026-03-11 08:25:18','2026-03-11 08:25:18'),(21,'buddha','Sigalovada Sutta','Seorang suami harus menghormati istrinya, tidak pernah tidak menghargainya, setia kepadanya, menyerahkan otoritas kepadanya, dan memberikannya perhiasan.',NULL,'Sigalovada Sutta (DN 31)',1,1,'2026-03-11 08:25:18','2026-03-11 08:25:18'),(22,'buddha','Anguttara Nikaya IV.55','Jika suami dan istri ingin hidup bersama baik di kehidupan ini maupun di kehidupan mendatang, keduanya harus memiliki keyakinan yang sama, kebajikan yang sama, kedermawanan yang sama, dan kebijaksanaan yang sama.',NULL,'Anguttara Nikaya IV.55',2,1,'2026-03-11 08:25:18','2026-03-11 08:25:18'),(23,'buddha','Dhammapada 328','Jika seseorang menemukan teman yang bijaksana, yang hidup baik dan penuh pengertian, hendaklah ia mengatasi segala bahaya dan berjalan bersamanya dengan gembira dan penuh kesadaran.',NULL,'Dhammapada 328',3,1,'2026-03-11 08:25:18','2026-03-11 08:25:18'),(24,'buddha','Metta Sutta','Semoga semua makhluk hidup berbahagia dan aman, semoga hati mereka dipenuhi kebahagiaan. Seperti seorang ibu melindungi anaknya, demikianlah hendaknya cinta kasih tanpa batas dipancarkan ke seluruh dunia.',NULL,'Metta Sutta (Sn 1.8)',4,1,'2026-03-11 08:25:18','2026-03-11 08:25:18'),(25,'buddha','Samyutta Nikaya I.4','Cinta sejati lahir dari pengertian. Dalam pengertian tumbuh kesabaran, dalam kesabaran tumbuh kesetiaan, dan dalam kesetiaan tumbuh cinta abadi.',NULL,'Samyutta Nikaya I.4',5,1,'2026-03-11 08:25:18','2026-03-11 08:25:18'),(26,'umum','Kutipan Cinta #1','Cinta tidak memandang dengan mata, tetapi dengan hati. Dua jiwa yang ditakdirkan bersama akan selalu menemukan jalannya pulang.',NULL,'Kutipan Pernikahan',1,1,'2026-03-11 08:25:18','2026-03-11 08:25:18'),(27,'umum','Kutipan Cinta #2','Dalam pernikahan, bukan kesempurnaan yang dicari, melainkan ketulusan untuk saling melengkapi. Dua hati yang bersatu dalam cinta akan menguatkan satu sama lain.',NULL,'Kutipan Pernikahan',2,1,'2026-03-11 08:25:18','2026-03-11 08:25:18'),(28,'umum','Kutipan Cinta #3','Pernikahan adalah awal dari sebuah perjalanan indah bersama. Dengan cinta sebagai kompas dan kesetiaan sebagai peta, setiap langkah menjadi bermakna.',NULL,'Kutipan Pernikahan',3,1,'2026-03-11 08:25:18','2026-03-11 08:25:18'),(29,'umum','Kahlil Gibran','Cinta satu sama lain, tetapi janganlah membuat ikatan cinta. Biarkanlah cinta itu menjadi lautan yang bergerak di antara pantai-pantai jiwa kalian.',NULL,'Kahlil Gibran',4,1,'2026-03-11 08:25:18','2026-03-11 08:25:18'),(30,'umum','Kutipan Cinta #5','Tidak ada kata yang lebih indah dari \'kita\'. Karena dalam \'kita\', ada cerita dua hati yang memilih untuk berjalan bersama, dalam suka dan duka.',NULL,'Kutipan Pernikahan',5,1,'2026-03-11 08:25:18','2026-03-11 08:25:18');
/*!40000 ALTER TABLE `quote_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reseller_plan_prices`
--

DROP TABLE IF EXISTS `reseller_plan_prices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reseller_plan_prices` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `reseller_id` bigint unsigned NOT NULL,
  `plan_id` bigint unsigned NOT NULL,
  `reseller_price` decimal(12,2) NOT NULL COMMENT 'Harga jual reseller ke user',
  `normal_price` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reseller_plan_prices_reseller_id_plan_id_unique` (`reseller_id`,`plan_id`),
  KEY `reseller_plan_prices_plan_id_foreign` (`plan_id`),
  CONSTRAINT `reseller_plan_prices_plan_id_foreign` FOREIGN KEY (`plan_id`) REFERENCES `subscription_plans` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reseller_plan_prices_reseller_id_foreign` FOREIGN KEY (`reseller_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reseller_plan_prices`
--

LOCK TABLES `reseller_plan_prices` WRITE;
/*!40000 ALTER TABLE `reseller_plan_prices` DISABLE KEYS */;
INSERT INTO `reseller_plan_prices` VALUES (1,6,1,0.00,NULL,'2026-03-15 10:15:15','2026-03-15 10:15:15'),(2,6,2,50000.00,100000.00,'2026-03-15 10:15:15','2026-03-18 12:21:35'),(3,6,3,120000.00,190000.00,'2026-03-15 10:15:15','2026-03-18 12:21:35'),(4,6,4,199000.00,299000.00,'2026-03-15 10:15:15','2026-03-18 12:21:35');
/*!40000 ALTER TABLE `reseller_plan_prices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reseller_settings`
--

DROP TABLE IF EXISTS `reseller_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reseller_settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `brand_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `brand_logo` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subdomain` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `custom_domain` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `landing_page_template` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'default',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `footer_description` text COLLATE utf8mb4_unicode_ci,
  `footer_phone` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `footer_email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `footer_whatsapp` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `footer_instagram` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `footer_tiktok` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `footer_address` text COLLATE utf8mb4_unicode_ci,
  `bank_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_account` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_holder` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reseller_settings_user_id_unique` (`user_id`),
  UNIQUE KEY `reseller_settings_subdomain_unique` (`subdomain`),
  UNIQUE KEY `reseller_settings_custom_domain_unique` (`custom_domain`),
  CONSTRAINT `reseller_settings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reseller_settings`
--

LOCK TABLES `reseller_settings` WRITE;
/*!40000 ALTER TABLE `reseller_settings` DISABLE KEYS */;
INSERT INTO `reseller_settings` VALUES (1,6,'Hello Media','reseller/logos/WU2TVEE7RQl3RigaEc3h4xOhsEFLreNyT9VM5JVT.jpg','testbrand',NULL,'minimal',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-12 11:04:46','2026-05-22 19:52:07'),(2,1,'Administrator','reseller/logos/IHD8eB9QH0Tv7p7tFHTXv6tEa9oswYQeozo8JRsH.png',NULL,NULL,'minimal',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-12 11:19:56','2026-03-12 11:51:55');
/*!40000 ALTER TABLE `reseller_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reseller_wallet_transactions`
--

DROP TABLE IF EXISTS `reseller_wallet_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reseller_wallet_transactions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `reseller_id` bigint unsigned NOT NULL,
  `payment_id` bigint unsigned DEFAULT NULL,
  `type` enum('credit','debit') COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `balance_after` decimal(15,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reseller_wallet_transactions_reseller_id_foreign` (`reseller_id`),
  KEY `reseller_wallet_transactions_payment_id_foreign` (`payment_id`),
  CONSTRAINT `reseller_wallet_transactions_payment_id_foreign` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`) ON DELETE SET NULL,
  CONSTRAINT `reseller_wallet_transactions_reseller_id_foreign` FOREIGN KEY (`reseller_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reseller_wallet_transactions`
--

LOCK TABLES `reseller_wallet_transactions` WRITE;
/*!40000 ALTER TABLE `reseller_wallet_transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `reseller_wallet_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reseller_wallets`
--

DROP TABLE IF EXISTS `reseller_wallets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reseller_wallets` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `reseller_id` bigint unsigned NOT NULL,
  `balance` decimal(15,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reseller_wallets_reseller_id_foreign` (`reseller_id`),
  CONSTRAINT `reseller_wallets_reseller_id_foreign` FOREIGN KEY (`reseller_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reseller_wallets`
--

LOCK TABLES `reseller_wallets` WRITE;
/*!40000 ALTER TABLE `reseller_wallets` DISABLE KEYS */;
/*!40000 ALTER TABLE `reseller_wallets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rsvps`
--

DROP TABLE IF EXISTS `rsvps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rsvps` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `guest_id` bigint unsigned NOT NULL,
  `invitation_id` bigint unsigned NOT NULL,
  `attendance` enum('hadir','tidak_hadir','belum_pasti') COLLATE utf8mb4_unicode_ci NOT NULL,
  `number_of_guests` tinyint NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `rsvps_guest_id_foreign` (`guest_id`),
  KEY `rsvps_invitation_id_foreign` (`invitation_id`),
  CONSTRAINT `rsvps_guest_id_foreign` FOREIGN KEY (`guest_id`) REFERENCES `guests` (`id`) ON DELETE CASCADE,
  CONSTRAINT `rsvps_invitation_id_foreign` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rsvps`
--

LOCK TABLES `rsvps` WRITE;
/*!40000 ALTER TABLE `rsvps` DISABLE KEYS */;
/*!40000 ALTER TABLE `rsvps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('Ydq9cVCLTlwTAJXClppNFIeSjGucJWcqY8D9vOZf',2,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','YTo0OntzOjY6Il90b2tlbiI7czo0MDoid3c5TEUwcHBUSFFIaDhCaGh3YWF1MjJ4Wlk2dHFQendlZVcxYnc0cyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTE6Imh0dHA6Ly91bmRhbmdhbi1kaWdpdGFsLnRlc3QvdS9taXJhLXJhbmRpP3ByZXZpZXc9MSI7czo1OiJyb3V0ZSI7czoxNToiaW52aXRhdGlvbi5zaG93Ijt9czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6Mjt9',1779550688);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscription_plans`
--

DROP TABLE IF EXISTS `subscription_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscription_plans` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(12,2) NOT NULL DEFAULT '0.00',
  `duration_days` int NOT NULL DEFAULT '0' COMMENT '0 = unlimited/free',
  `max_guests` int NOT NULL DEFAULT '100',
  `max_galleries` int NOT NULL DEFAULT '5',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` tinyint NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `subscription_plans_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscription_plans`
--

LOCK TABLES `subscription_plans` WRITE;
/*!40000 ALTER TABLE `subscription_plans` DISABLE KEYS */;
INSERT INTO `subscription_plans` VALUES (1,'Free','free','Paket gratis dengan fitur terbatas',0.00,0,50,3,1,1,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(2,'Silver','silver','Paket dasar untuk undangan digital',20000.00,90,200,10,1,2,'2026-03-08 08:24:46','2026-03-15 09:50:57'),(3,'Gold','gold','Paket lengkap dengan semua fitur',99000.00,180,500,25,1,3,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(4,'Platinum','platinum','Paket premium tanpa batas',199000.00,365,9999,50,1,4,'2026-03-08 08:24:46','2026-03-08 08:24:46');
/*!40000 ALTER TABLE `subscription_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscriptions`
--

DROP TABLE IF EXISTS `subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscriptions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `plan_id` bigint unsigned NOT NULL,
  `status` enum('active','expired','cancelled','pending') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `starts_at` timestamp NOT NULL,
  `expires_at` timestamp NULL DEFAULT NULL COMMENT 'NULL = tidak expire (free plan)',
  `payment_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `subscriptions_plan_id_foreign` (`plan_id`),
  KEY `subscriptions_payment_id_foreign` (`payment_id`),
  KEY `subscriptions_user_id_status_index` (`user_id`,`status`),
  CONSTRAINT `subscriptions_payment_id_foreign` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`) ON DELETE SET NULL,
  CONSTRAINT `subscriptions_plan_id_foreign` FOREIGN KEY (`plan_id`) REFERENCES `subscription_plans` (`id`),
  CONSTRAINT `subscriptions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscriptions`
--

LOCK TABLES `subscriptions` WRITE;
/*!40000 ALTER TABLE `subscriptions` DISABLE KEYS */;
INSERT INTO `subscriptions` VALUES (1,2,4,'active','2026-03-03 08:24:47','2026-08-30 08:24:47',1,'2026-03-08 08:24:47','2026-05-22 20:41:46'),(2,4,2,'active','2026-03-09 09:00:26','2027-03-09 09:00:26',NULL,'2026-03-09 09:00:26','2026-03-09 09:00:26'),(3,5,1,'active','2026-03-09 10:45:04',NULL,NULL,'2026-03-09 10:45:04','2026-03-09 11:06:35');
/*!40000 ALTER TABLE `subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `theme_sections`
--

DROP TABLE IF EXISTS `theme_sections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `theme_sections` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `theme_id` bigint unsigned NOT NULL,
  `section_key` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'cover, opening, bride_groom, event, gallery, love_story, bank, rsvp, wishes, closing, save_the_date, turut_mengundang, music',
  `section_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `component_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'nama React component',
  `default_order` int NOT NULL DEFAULT '0',
  `is_removable` tinyint(1) NOT NULL DEFAULT '1',
  `is_default` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `theme_sections_theme_id_foreign` (`theme_id`),
  CONSTRAINT `theme_sections_theme_id_foreign` FOREIGN KEY (`theme_id`) REFERENCES `themes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=187 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `theme_sections`
--

LOCK TABLES `theme_sections` WRITE;
/*!40000 ALTER TABLE `theme_sections` DISABLE KEYS */;
INSERT INTO `theme_sections` VALUES (45,5,'cover','Cover','CoverSection',1,0,1,'2026-03-08 09:28:42','2026-05-22 09:22:39'),(46,5,'opening','Opening','OpeningSection',2,1,1,'2026-03-08 09:28:42','2026-05-22 09:22:39'),(47,5,'bride_groom','Mempelai','BrideGroomSection',3,1,1,'2026-03-08 09:28:42','2026-05-22 09:22:39'),(48,5,'event','Acara','EventSection',6,1,1,'2026-03-08 09:28:42','2026-05-22 09:22:39'),(49,5,'gallery','Galeri','GallerySection',7,1,1,'2026-03-08 09:28:42','2026-05-22 09:22:39'),(50,5,'love_story','Cerita Kami','LoveStorySection',5,1,1,'2026-03-08 09:28:42','2026-05-22 09:22:39'),(51,5,'bank','Amplop Digital','BankSection',10,1,1,'2026-03-08 09:28:42','2026-05-22 09:22:39'),(52,5,'rsvp','RSVP','RsvpSection',8,1,1,'2026-03-08 09:28:42','2026-05-22 09:22:39'),(53,5,'wishes','Ucapan','WishesSection',9,1,1,'2026-03-08 09:28:42','2026-05-22 09:22:39'),(54,5,'closing','Penutup','ClosingSection',11,1,1,'2026-03-08 09:28:42','2026-05-22 09:22:39'),(88,10,'cover','Cover','CoverSection',1,0,1,'2026-05-22 05:25:51','2026-05-22 09:22:39'),(89,10,'opening','Opening','OpeningSection',2,1,1,'2026-05-22 05:25:51','2026-05-22 09:22:39'),(90,10,'bride_groom','Mempelai','Bride_groomSection',3,1,1,'2026-05-22 05:25:51','2026-05-22 09:22:39'),(91,10,'love_story','Kisah Cinta','Love_storySection',5,1,1,'2026-05-22 05:25:51','2026-05-22 09:22:39'),(92,10,'event','Acara','EventSection',6,1,1,'2026-05-22 05:25:51','2026-05-22 09:22:39'),(93,10,'gallery','Galeri','GallerySection',7,1,1,'2026-05-22 05:25:51','2026-05-22 09:22:39'),(94,10,'rsvp','RSVP','RsvpSection',8,1,1,'2026-05-22 05:25:51','2026-05-22 09:22:39'),(95,10,'bank','Amplop Digital','BankSection',10,1,1,'2026-05-22 05:25:51','2026-05-22 09:22:39'),(96,10,'closing','Penutup','ClosingSection',11,0,1,'2026-05-22 05:25:51','2026-05-22 09:22:39'),(97,11,'cover','Cover','CoverSection',1,0,1,'2026-05-22 07:22:17','2026-05-22 09:22:39'),(98,11,'opening','Opening','OpeningSection',2,1,1,'2026-05-22 07:22:17','2026-05-22 09:22:39'),(99,11,'bride_groom','Mempelai','Bride_groomSection',3,1,1,'2026-05-22 07:22:17','2026-05-22 09:22:39'),(100,11,'love_story','Kisah Cinta','Love_storySection',5,1,1,'2026-05-22 07:22:17','2026-05-22 09:22:39'),(101,11,'event','Acara','EventSection',6,1,1,'2026-05-22 07:22:17','2026-05-22 09:22:39'),(102,11,'gallery','Galeri','GallerySection',7,1,1,'2026-05-22 07:22:17','2026-05-22 09:22:39'),(103,11,'rsvp','RSVP','RsvpSection',8,1,1,'2026-05-22 07:22:17','2026-05-22 09:22:39'),(104,11,'bank','Amplop Digital','BankSection',10,1,1,'2026-05-22 07:22:17','2026-05-22 09:22:39'),(105,11,'closing','Penutup','ClosingSection',11,0,1,'2026-05-22 07:22:17','2026-05-22 09:22:39'),(106,11,'countdown','Save The Date','CountdownSection',4,1,1,'2026-05-22 09:13:24','2026-05-22 09:22:39'),(107,11,'wishes','Ucapan','WishesSection',9,1,1,'2026-05-22 09:13:24','2026-05-22 09:22:39'),(108,10,'countdown','Save The Date','CountdownSection',4,1,1,'2026-05-22 09:13:54','2026-05-22 09:22:39'),(109,10,'wishes','Ucapan','WishesSection',9,1,1,'2026-05-22 09:13:54','2026-05-22 09:22:39'),(110,12,'cover','Cover','CoverSection',1,0,1,'2026-05-22 09:35:43','2026-05-22 09:35:43'),(111,12,'opening','Opening','OpeningSection',2,1,1,'2026-05-22 09:35:43','2026-05-22 09:35:43'),(112,12,'bride_groom','Mempelai','Bride_groomSection',3,1,1,'2026-05-22 09:35:43','2026-05-22 09:35:43'),(113,12,'countdown','Save The Date','CountdownSection',4,1,1,'2026-05-22 09:35:43','2026-05-22 09:35:43'),(114,12,'love_story','Kisah Cinta','Love_storySection',5,1,1,'2026-05-22 09:35:43','2026-05-22 09:35:43'),(115,12,'event','Acara','EventSection',6,1,1,'2026-05-22 09:35:43','2026-05-22 09:35:43'),(116,12,'gallery','Galeri','GallerySection',7,1,1,'2026-05-22 09:35:43','2026-05-22 09:35:43'),(117,12,'rsvp','RSVP','RsvpSection',8,1,1,'2026-05-22 09:35:43','2026-05-22 09:35:43'),(118,12,'wishes','Ucapan','WishesSection',9,1,1,'2026-05-22 09:35:43','2026-05-22 09:35:43'),(119,12,'bank','Amplop Digital','BankSection',10,1,1,'2026-05-22 09:35:43','2026-05-22 09:35:43'),(120,12,'closing','Penutup','ClosingSection',11,0,1,'2026-05-22 09:35:43','2026-05-22 09:35:43'),(132,13,'cover','Cover','CoverSection',1,0,1,'2026-05-22 20:46:26','2026-05-22 20:46:26'),(133,13,'opening','Opening','OpeningSection',2,1,1,'2026-05-22 20:46:26','2026-05-22 20:46:26'),(134,13,'bride_groom','Mempelai','Bride_groomSection',3,1,1,'2026-05-22 20:46:26','2026-05-22 20:46:26'),(135,13,'countdown','Save The Date','CountdownSection',4,1,1,'2026-05-22 20:46:26','2026-05-22 20:46:26'),(136,13,'love_story','Kisah Cinta','Love_storySection',5,1,1,'2026-05-22 20:46:26','2026-05-22 20:46:26'),(137,13,'event','Acara','EventSection',6,1,1,'2026-05-22 20:46:26','2026-05-22 20:46:26'),(138,13,'gallery','Galeri','GallerySection',7,1,1,'2026-05-22 20:46:26','2026-05-22 20:46:26'),(139,13,'rsvp','RSVP','RsvpSection',8,1,1,'2026-05-22 20:46:26','2026-05-22 20:46:26'),(140,13,'wishes','Ucapan','WishesSection',9,1,1,'2026-05-22 20:46:26','2026-05-22 20:46:26'),(141,13,'bank','Amplop Digital','BankSection',10,1,1,'2026-05-22 20:46:26','2026-05-22 20:46:26'),(142,13,'closing','Penutup','ClosingSection',11,0,1,'2026-05-22 20:46:26','2026-05-22 20:46:26'),(143,15,'cover','Cover','CoverSection',1,0,1,'2026-05-22 22:52:58','2026-05-22 22:52:58'),(144,15,'opening','Opening','OpeningSection',2,1,1,'2026-05-22 22:52:58','2026-05-22 22:52:58'),(145,15,'bride_groom','Mempelai','Bride_groomSection',3,1,1,'2026-05-22 22:52:58','2026-05-22 22:52:58'),(146,15,'countdown','Save The Date','CountdownSection',4,1,1,'2026-05-22 22:52:58','2026-05-22 22:52:58'),(147,15,'love_story','Kisah Cinta','Love_storySection',5,1,1,'2026-05-22 22:52:58','2026-05-22 22:52:58'),(148,15,'event','Acara','EventSection',6,1,1,'2026-05-22 22:52:58','2026-05-22 22:52:58'),(149,15,'gallery','Galeri','GallerySection',7,1,1,'2026-05-22 22:52:58','2026-05-22 22:52:58'),(150,15,'rsvp','RSVP','RsvpSection',8,1,1,'2026-05-22 22:52:58','2026-05-22 22:52:58'),(151,15,'wishes','Ucapan','WishesSection',9,1,1,'2026-05-22 22:52:58','2026-05-22 22:52:58'),(152,15,'bank','Amplop Digital','BankSection',10,1,1,'2026-05-22 22:52:58','2026-05-22 22:52:58'),(153,15,'closing','Penutup','ClosingSection',11,0,1,'2026-05-22 22:52:58','2026-05-22 22:52:58'),(154,16,'cover','Cover','CoverSection',1,0,1,'2026-05-23 01:49:43','2026-05-23 01:49:43'),(155,16,'opening','Opening','OpeningSection',2,1,1,'2026-05-23 01:49:43','2026-05-23 01:49:43'),(156,16,'bride_groom','Mempelai','Bride_groomSection',3,1,1,'2026-05-23 01:49:43','2026-05-23 01:49:43'),(157,16,'countdown','Save The Date','CountdownSection',4,1,1,'2026-05-23 01:49:43','2026-05-23 01:49:43'),(158,16,'love_story','Kisah Cinta','Love_storySection',5,1,1,'2026-05-23 01:49:43','2026-05-23 01:49:43'),(159,16,'event','Acara','EventSection',6,1,1,'2026-05-23 01:49:43','2026-05-23 01:49:43'),(160,16,'gallery','Galeri','GallerySection',7,1,1,'2026-05-23 01:49:43','2026-05-23 01:49:43'),(161,16,'rsvp','RSVP','RsvpSection',8,1,1,'2026-05-23 01:49:43','2026-05-23 01:49:43'),(162,16,'wishes','Ucapan','WishesSection',9,1,1,'2026-05-23 01:49:43','2026-05-23 01:49:43'),(163,16,'bank','Amplop Digital','BankSection',10,1,1,'2026-05-23 01:49:43','2026-05-23 01:49:43'),(164,16,'closing','Penutup','ClosingSection',11,0,1,'2026-05-23 01:49:43','2026-05-23 01:49:43'),(165,17,'cover','Cover','CoverSection',1,0,1,'2026-05-23 07:58:07','2026-05-23 07:58:07'),(166,17,'opening','Opening','OpeningSection',2,1,1,'2026-05-23 07:58:07','2026-05-23 07:58:07'),(167,17,'bride_groom','Mempelai','Bride_groomSection',3,1,1,'2026-05-23 07:58:07','2026-05-23 07:58:07'),(168,17,'countdown','Save The Date','CountdownSection',4,1,1,'2026-05-23 07:58:07','2026-05-23 07:58:07'),(169,17,'love_story','Kisah Cinta','Love_storySection',5,1,1,'2026-05-23 07:58:07','2026-05-23 07:58:07'),(170,17,'event','Acara','EventSection',6,1,1,'2026-05-23 07:58:07','2026-05-23 07:58:07'),(171,17,'gallery','Galeri','GallerySection',7,1,1,'2026-05-23 07:58:07','2026-05-23 07:58:07'),(172,17,'rsvp','RSVP','RsvpSection',8,1,1,'2026-05-23 07:58:07','2026-05-23 07:58:07'),(173,17,'wishes','Ucapan','WishesSection',9,1,1,'2026-05-23 07:58:07','2026-05-23 07:58:07'),(174,17,'bank','Amplop Digital','BankSection',10,1,1,'2026-05-23 07:58:07','2026-05-23 07:58:07'),(175,17,'closing','Penutup','ClosingSection',11,0,1,'2026-05-23 07:58:07','2026-05-23 07:58:07'),(176,18,'cover','Cover','CoverSection',1,0,1,'2026-05-23 08:30:52','2026-05-23 08:30:52'),(177,18,'opening','Opening','OpeningSection',2,1,1,'2026-05-23 08:30:52','2026-05-23 08:30:52'),(178,18,'bride_groom','Mempelai','Bride_groomSection',3,1,1,'2026-05-23 08:30:52','2026-05-23 08:30:52'),(179,18,'countdown','Save The Date','CountdownSection',4,1,1,'2026-05-23 08:30:52','2026-05-23 08:30:52'),(180,18,'love_story','Kisah Cinta','Love_storySection',5,1,1,'2026-05-23 08:30:52','2026-05-23 08:30:52'),(181,18,'event','Acara','EventSection',6,1,1,'2026-05-23 08:30:52','2026-05-23 08:30:52'),(182,18,'gallery','Galeri','GallerySection',7,1,1,'2026-05-23 08:30:52','2026-05-23 08:30:52'),(183,18,'rsvp','RSVP','RsvpSection',8,1,1,'2026-05-23 08:30:52','2026-05-23 08:30:52'),(184,18,'wishes','Ucapan','WishesSection',9,1,1,'2026-05-23 08:30:52','2026-05-23 08:30:52'),(185,18,'bank','Amplop Digital','BankSection',10,1,1,'2026-05-23 08:30:52','2026-05-23 08:30:52'),(186,18,'closing','Penutup','ClosingSection',11,0,1,'2026-05-23 08:30:52','2026-05-23 08:30:52');
/*!40000 ALTER TABLE `theme_sections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `themes`
--

DROP TABLE IF EXISTS `themes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `themes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'wedding',
  `thumbnail` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `preview_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'floral, elegant, rustic, modern, islamic',
  `color_scheme` json DEFAULT NULL COMMENT '{"primary":"#xxx","secondary":"#xxx","accent":"#xxx","bg":"#xxx","text":"#xxx"}',
  `font_config` json DEFAULT NULL COMMENT '{"heading":"font","body":"font","script":"font"}',
  `default_data` json DEFAULT NULL COMMENT 'Default seed data for invitation when theme is selected (bride_grooms, events, galleries, love_stories, bank_accounts, opening, music, etc.)',
  `css_file` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `supports_scroll` tinyint(1) NOT NULL DEFAULT '1',
  `supports_slide` tinyint(1) NOT NULL DEFAULT '1',
  `supports_tab` tinyint(1) NOT NULL DEFAULT '1',
  `is_premium` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `base_likes` int unsigned NOT NULL DEFAULT '0',
  `real_likes` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `themes_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `themes`
--

LOCK TABLES `themes` WRITE;
/*!40000 ALTER TABLE `themes` DISABLE KEYS */;
INSERT INTO `themes` VALUES (5,'Adat Jawa','adat-jawa','wedding','/themes/adat-jawa/the-wedding.png',NULL,'islamic','{\"bg\": \"#FFF9F0\", \"text\": \"#2D2D2D\", \"accent\": \"#DAA520\", \"primary\": \"#C5963B\", \"secondary\": \"#8B6914\"}','{\"body\": \"Poppins\", \"script\": \"Great Vibes\", \"heading\": \"Cinzel\"}',NULL,NULL,1,0,0,1,1,10,'2026-03-08 09:28:42','2026-03-08 09:28:42',0,0),(10,'Utary','utary','wedding','/themes/utary/thumbnail.webp','/themes/utary/preview.webp','Premium','{\"bg\": \"#0c0c0c\", \"text\": \"#ffffff\", \"accent\": \"#c8b680\", \"primary\": \"#c8b680\", \"secondary\": \"#c8b680\"}','{\"body\": \"Poppins\", \"script\": \"Great Vibes\", \"heading\": \"Playfair Display\"}','{\"events\": [{\"end_time\": \"10:00\", \"timezone\": \"WIB\", \"event_date\": \"2026-12-20\", \"event_name\": \"Akad Nikah\", \"event_type\": \"akad\", \"gmaps_link\": \"https://maps.app.goo.gl/\", \"is_primary\": true, \"sort_order\": 0, \"start_time\": \"08:00\", \"venue_name\": \"Vue Palace Hotel\", \"venue_address\": \"Jl. Otto Iskandar Dinata No. 3, Babakan Ciamis, Kec. Sumur Bandung, Kota Bandung\"}, {\"end_time\": \"13:00\", \"timezone\": \"WIB\", \"event_date\": \"2026-12-20\", \"event_name\": \"Resepsi\", \"event_type\": \"resepsi\", \"gmaps_link\": \"https://maps.app.goo.gl/\", \"is_primary\": false, \"sort_order\": 1, \"start_time\": \"11:00\", \"venue_name\": \"Vue Palace Hotel\", \"venue_address\": \"Jl. Otto Iskandar Dinata No. 3, Babakan Ciamis, Kec. Sumur Bandung, Kota Bandung\"}], \"guests\": [{\"name\": \"Ahmad Fadhil\", \"phone\": \"081111111111\", \"group_name\": \"Keluarga\"}, {\"name\": \"Siti Aisyah\", \"phone\": \"081222222222\", \"group_name\": \"Keluarga\"}, {\"name\": \"Budi Hartono\", \"phone\": \"081333333333\", \"group_name\": \"Kantor\"}], \"wishes\": [{\"message\": \"Selamat menempuh hidup baru Tary & Fachrul! Semoga sakinah mawaddah wa rahmah. ✨\", \"sender_name\": \"Ahmad Fadhil\"}, {\"message\": \"Happy wedding ya Tary! Bahagia selalu selamanya. 💕\", \"sender_name\": \"Siti Aisyah\"}, {\"message\": \"Selamat berhabagia untuk kedua mempelai!\", \"sender_name\": \"Budi Hartono\"}], \"galleries\": [{\"caption\": \"\", \"image_url\": \"/themes/utary/asset/utary-1.webp\", \"sort_order\": 0}, {\"caption\": \"\", \"image_url\": \"/themes/utary/asset/utary-2.webp\", \"sort_order\": 1}, {\"caption\": \"\", \"image_url\": \"/themes/utary/asset/utary-3.webp\", \"sort_order\": 2}, {\"caption\": \"\", \"image_url\": \"/themes/utary/asset/utary-4.webp\", \"sort_order\": 3}, {\"caption\": \"\", \"image_url\": \"/themes/utary/asset/utary-5.webp\", \"sort_order\": 4}, {\"caption\": \"\", \"image_url\": \"/themes/utary/asset/utary-6.webp\", \"sort_order\": 5}], \"invitation\": {\"religion\": \"islam\", \"music_url\": \"/audio/backsound.mp3\", \"cover_title\": \"Tary & Fachrul\", \"enable_rsvp\": true, \"closing_text\": \"Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu, Saudara/i berkenan hadir di hari bahagia kami.\", \"gallery_mode\": \"grid\", \"opening_ayat\": \"Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah).\", \"opening_text\": \"Assalamu\'alaikum Warahmatullahi Wabarakatuh\\n\\nDengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan kami.\", \"closing_title\": \"THANK YOU\", \"enable_wishes\": true, \"opening_title\": \"The Wedding Of\", \"particle_type\": \"gold-dust\", \"cover_subtitle\": \"Kami mengundang Anda untuk menghadiri acara pernikahan kami.\", \"music_autoplay\": true, \"opening_ayat_source\": \"Adz-Dzariyat: 49\", \"countdown_target_date\": \"2026-12-20 08:00:00\", \"save_the_date_enabled\": true, \"turut_mengundang_text\": \"\", \"opening_ayat_translation\": \"Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah).\"}, \"bride_grooms\": [{\"bio\": \"\", \"photo\": \"/themes/utary/asset/utary-1.webp\", \"gender\": \"wanita\", \"nickname\": \"Tary\", \"full_name\": \"Utary Adhita\", \"instagram\": \"USERNAME\", \"child_order\": \"Kedua\", \"father_name\": \"Nama Bapak\", \"mother_name\": \"Nama Ibu\", \"order_number\": 1}, {\"bio\": \"\", \"photo\": \"/themes/utary/asset/utary-2.webp\", \"gender\": \"pria\", \"nickname\": \"Fachrul\", \"full_name\": \"Fachrul Rozi\", \"instagram\": \"USERNAME\", \"child_order\": \"Kedua\", \"father_name\": \"Nama Bapak\", \"mother_name\": \"Nama Ibu\", \"order_number\": 2}], \"love_stories\": [{\"title\": \"Chapter One: Awal Bertemu\", \"sort_order\": 0, \"description\": \"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt str ut labore et dolore magna aliqua. Nulla facilisi cras fermentum odio eu feugiat pretium nibh ipsum.\"}, {\"title\": \"Chapter Two: Menjalin Hubungan\", \"sort_order\": 1, \"description\": \"Facilisis sed odio morbi quis commodo odio. Condimentum mattis pellentesque id nibh tortor id aliquet. Quis imperdiet massa tincidunt nunc pulvinar sapien et ligula.\"}, {\"title\": \"Chapter Three: Bertunangan\", \"sort_order\": 2, \"description\": \"Magna fermentum iaculis eu non. Pretium lectus quam id leo. Arcu vitae elementum curabitur vitae nunc sed.\"}, {\"title\": \"Chapter Four: Hari Pernikahan\", \"sort_order\": 3, \"description\": \"Augue lacus viverra vitae congue eu consequat. Eget nunc scelerisque viverra mauris in aliquam sem fringilla.\"}], \"bank_accounts\": [{\"bank_name\": \"BCA\", \"sort_order\": 0, \"account_name\": \"Nama Penerima\", \"account_number\": \"0123456789\"}, {\"bank_name\": \"GOPAY\", \"sort_order\": 1, \"account_name\": \"Nama Penerima\", \"account_number\": \"0123456789\"}]}','utary/style.css',1,0,0,1,1,10,'2026-05-22 05:25:51','2026-05-22 09:13:54',0,0),(11,'Netflix','netflix','wedding','/themes/modern-black/thumbnail.jpg',NULL,'modern','{\"bg\": \"#000000\", \"text\": \"#FFFFFF\", \"accent\": \"#E50914\", \"primary\": \"#E50914\", \"secondary\": \"#141414\"}','{\"body\": \"Helvetica Neue\", \"script\": \"Great Vibes\", \"heading\": \"Bebas Neue\"}',NULL,'netflix/style.css',1,0,0,1,1,11,'2026-05-22 07:22:17','2026-05-22 09:13:24',0,0),(12,'Luxury 2','luxury-02','wedding','/themes/modern-black/thumbnail.jpg',NULL,'premium','{\"bg\": \"#080808\", \"text\": \"#ffffff\", \"accent\": \"#ffffff\", \"primary\": \"#c5a880\", \"secondary\": \"#000000\"}','{\"body\": \"Poppins\", \"script\": \"Great Vibes\", \"heading\": \"Jura\"}',NULL,'luxury-02/style.css',1,1,0,1,1,12,'2026-05-22 09:35:43','2026-05-22 09:37:52',0,0),(13,'Luxury 1','luxury-01','wedding','/themes/modern-black/thumbnail.jpg','','premium','{\"bg\": \"#080808\", \"text\": \"#ffffff\", \"accent\": \"#ffffff\", \"primary\": \"#c5a880\", \"secondary\": \"#000000\"}','{\"body\": \"Poppins\", \"script\": \"Great Vibes\", \"heading\": \"Jura\"}','[]','luxury-01/style.css',1,1,0,1,1,10,'2026-05-22 19:21:23','2026-05-22 20:46:26',0,0),(15,'Luxury 3','luxury-03','wedding','/themes/modern-black/thumbnail.jpg',NULL,'premium','{\"bg\": \"#0d0203\", \"text\": \"#ffffff\", \"accent\": \"#ffffff\", \"primary\": \"#b82d40\", \"secondary\": \"#0d0203\"}','{\"body\": \"Poppins\", \"script\": \"Great Vibes\", \"heading\": \"Jura\"}',NULL,'luxury-03/style.css',1,1,0,1,1,13,'2026-05-22 22:52:57','2026-05-22 22:52:57',0,0),(16,'Aruna','aruna','wedding','/themes/aruna/thumbnail.png','/themes/aruna/preview.png','Premium','{\"bg\": \"#0c0c0c\", \"text\": \"#ffffff\", \"accent\": \"#cdbb83\", \"primary\": \"#c5a880\", \"secondary\": \"#847d4a\"}','{\"body\": \"Poppins\", \"script\": \"Great Vibes\", \"heading\": \"Playfair Display\"}','{\"events\": [{\"end_time\": \"10:00\", \"timezone\": \"WIB\", \"event_date\": \"2026-12-20\", \"event_name\": \"Akad Nikah\", \"event_type\": \"akad\", \"gmaps_link\": \"https://maps.app.goo.gl/\", \"is_primary\": true, \"sort_order\": 0, \"start_time\": \"08:00\", \"venue_name\": \"Vue Palace Hotel\", \"venue_address\": \"Jl. Otto Iskandar Dinata No. 3, Babakan Ciamis, Kec. Sumur Bandung, Kota Bandung\"}, {\"end_time\": \"13:00\", \"timezone\": \"WIB\", \"event_date\": \"2026-12-20\", \"event_name\": \"Resepsi\", \"event_type\": \"resepsi\", \"gmaps_link\": \"https://maps.app.goo.gl/\", \"is_primary\": false, \"sort_order\": 1, \"start_time\": \"11:00\", \"venue_name\": \"Vue Palace Hotel\", \"venue_address\": \"Jl. Otto Iskandar Dinata No. 3, Babakan Ciamis, Kec. Sumur Bandung, Kota Bandung\"}], \"guests\": [{\"name\": \"Ahmad Fadhil\", \"phone\": \"081111111111\", \"group_name\": \"Keluarga\"}], \"wishes\": [{\"message\": \"Selamat menempuh hidup baru Ila & Fachrul! Semoga sakinah mawaddah wa rahmah. ✨\", \"sender_name\": \"Ahmad Fadhil\"}], \"galleries\": [{\"caption\": \"\", \"image_url\": \"https://picsum.photos/seed/aruna1/800/1200\", \"sort_order\": 0}, {\"caption\": \"\", \"image_url\": \"https://picsum.photos/seed/aruna2/800/800\", \"sort_order\": 1}, {\"caption\": \"\", \"image_url\": \"https://picsum.photos/seed/aruna3/800/800\", \"sort_order\": 2}], \"invitation\": {\"religion\": \"islam\", \"music_url\": \"/audio/backsound.mp3\", \"cover_title\": \"Ila & Fachrul\", \"enable_rsvp\": true, \"closing_text\": \"Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu, Saudara/i berkenan hadir di hari bahagia kami.\", \"gallery_mode\": \"grid\", \"opening_ayat\": \"Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah).\", \"opening_text\": \"Assalamu\'alaikum Warahmatullahi Wabarakatuh\\n\\nDengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan kami.\", \"closing_title\": \"THANK YOU\", \"enable_wishes\": true, \"opening_title\": \"The Wedding Of\", \"particle_type\": \"gold-dust\", \"cover_subtitle\": \"Kami mengundang Anda untuk menghadiri acara pernikahan kami.\", \"music_autoplay\": true, \"opening_ayat_source\": \"Adz-Dzariyat: 49\", \"countdown_target_date\": \"2026-12-20 08:00:00\", \"save_the_date_enabled\": true, \"turut_mengundang_text\": \"\", \"opening_ayat_translation\": \"Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah).\"}, \"bride_grooms\": [{\"bio\": \"\", \"photo\": \"\", \"gender\": \"wanita\", \"nickname\": \"Ila\", \"full_name\": \"Aruna Adhita\", \"instagram\": \"USERNAME\", \"child_order\": \"Kedua\", \"father_name\": \"Bapak Nama_Bapak\", \"mother_name\": \"Ibu Nama_Ibu\", \"order_number\": 1}, {\"bio\": \"\", \"photo\": \"\", \"gender\": \"pria\", \"nickname\": \"Fachrul\", \"full_name\": \"Fachrul Rozi\", \"instagram\": \"USERNAME\", \"child_order\": \"Kedua\", \"father_name\": \"Bapak Nama_Bapak\", \"mother_name\": \"Ibu Nama_Ibu\", \"order_number\": 2}], \"love_stories\": [{\"title\": \"Chapter One: Awal Bertemu\", \"sort_order\": 0, \"description\": \"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nulla facilisi cras fermentum odio eu feugiat pretium nibh ipsum.\"}, {\"title\": \"Chapter Two: Menjalin Hubungan\", \"sort_order\": 1, \"description\": \"Facilisis sed odio morbi quis commodo odio. Condimentum mattis pellentesque id nibh tortor id aliquet. Quis imperdiet massa tincidunt nunc pulvinar sapien et ligula.\"}, {\"title\": \"Chapter Three: Bertunangan\", \"sort_order\": 2, \"description\": \"Magna fermentum iaculis eu non. Pretium lectus quam id leo. Arcu vitae elementum curabitur vitae nunc sed.\"}, {\"title\": \"Chapter Four: Hari Pernikahan\", \"sort_order\": 3, \"description\": \"Augue lacus viverra vitae congue eu consequat. Eget nunc scelerisque viverra mauris in aliquam sem fringilla.\"}], \"bank_accounts\": [{\"bank_name\": \"BCA\", \"sort_order\": 0, \"account_name\": \"Nama Penerima\", \"account_number\": \"0123456789\"}, {\"bank_name\": \"GOPAY\", \"sort_order\": 1, \"account_name\": \"Nama Penerima\", \"account_number\": \"0123456789\"}]}','aruna/style.css',1,0,0,1,1,11,'2026-05-23 01:49:43','2026-05-23 02:42:20',0,0),(17,'Luxury 4','luxury-04','wedding','/themes/modern-black/thumbnail.jpg',NULL,'premium','{\"bg\": \"#f5eff1\", \"text\": \"#3a2a2d\", \"accent\": \"#faf8f9\", \"primary\": \"#4a0e17\", \"secondary\": \"#f5eff1\"}','{\"body\": \"Poppins\", \"script\": \"Great Vibes\", \"heading\": \"Jura\"}',NULL,'luxury-04/style.css',1,1,0,1,1,14,'2026-05-23 07:58:07','2026-05-23 07:58:07',0,0),(18,'Tema Wayang','wayang','wedding','/themes/wayang/thumbnail.webp','/themes/wayang/preview.webp','Premium','{\"bg\": \"#1B1A1D\", \"text\": \"#ffffff\", \"accent\": \"#BE9E6F\", \"primary\": \"#D4B17F\", \"secondary\": \"#DDC068\"}','{\"body\": \"Poppins\", \"script\": \"Tangerine\", \"heading\": \"Elsie Swash Caps\"}','{\"events\": [{\"end_time\": \"10:00\", \"timezone\": \"WIB\", \"event_date\": \"2026-12-25\", \"event_name\": \"Akad Nikah\", \"event_type\": \"akad\", \"gmaps_link\": \"https://maps.google.com/?q=Gedung+Kesenian+Yogyakarta\", \"is_primary\": true, \"sort_order\": 0, \"start_time\": \"08:00\", \"venue_name\": \"Gedung Kesenian Jogja\", \"venue_address\": \"Jl. Panembahan Senopati No. 2, Yogyakarta\"}, {\"end_time\": \"14:00\", \"timezone\": \"WIB\", \"event_date\": \"2026-12-25\", \"event_name\": \"Resepsi Pernikahan\", \"event_type\": \"resepsi\", \"gmaps_link\": \"https://maps.google.com/?q=Gedung+Kesenian+Yogyakarta\", \"is_primary\": false, \"sort_order\": 1, \"start_time\": \"11:00\", \"venue_name\": \"Gedung Kesenian Jogja\", \"venue_address\": \"Jl. Panembahan Senopati No. 2, Yogyakarta\"}], \"guests\": [{\"name\": \"Ahmad Saputra\", \"phone\": \"081122334455\", \"group_name\": \"Keluarga\"}, {\"name\": \"Siti Aminah\", \"phone\": \"082233445566\", \"group_name\": \"Tetangga\"}], \"wishes\": [{\"message\": \"Selamat menempuh hidup baru Bimo & Raras! Semoga sakinah mawaddah wa rahmah selalu.\", \"sender_name\": \"Ahmad Saputra\"}, {\"message\": \"Selamat berbahagia ya! Berkah dunia akhirat untuk kedua mempelai.\", \"sender_name\": \"Siti Aminah\"}], \"galleries\": [{\"caption\": \"\", \"image_url\": \"/themes/wayang/asset/Mini-1-1-2-1024x683.jpg\", \"sort_order\": 0}, {\"caption\": \"\", \"image_url\": \"/themes/wayang/asset/Mini-1-3-e1760494660200.jpg\", \"sort_order\": 1}], \"invitation\": {\"religion\": \"islam\", \"music_url\": \"/audio/backsound.mp3\", \"cover_title\": \"Bimo & Raras\", \"enable_rsvp\": true, \"closing_text\": \"Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu, Saudara/i berkenan hadir di hari bahagia kami.\", \"gallery_mode\": \"grid\", \"opening_ayat\": \"Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah).\", \"opening_text\": \"Assalamu\'alaikum Warahmatullahi Wabarakatuh\\n\\nDengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan kami.\", \"closing_title\": \"THANK YOU\", \"enable_wishes\": true, \"opening_title\": \"The Wedding Of\", \"particle_type\": \"gold-dust\", \"cover_subtitle\": \"Kami mengundang Anda untuk menghadiri acara pernikahan kami.\", \"music_autoplay\": true, \"opening_ayat_source\": \"Adz-Dzariyat: 49\", \"countdown_target_date\": \"2026-12-25 08:00:00\", \"save_the_date_enabled\": true, \"turut_mengundang_text\": \"\", \"opening_ayat_translation\": \"Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah).\"}, \"bride_grooms\": [{\"bio\": \"\", \"photo\": \"/themes/wayang/asset/jawa-hitam-p-e1760493392899.jpg\", \"gender\": \"pria\", \"nickname\": \"Bimo\", \"full_name\": \"Bimo Wicaksono\", \"instagram\": \"USERNAME\", \"child_order\": \"Pertama\", \"father_name\": \"H. Joko Wicaksono\", \"mother_name\": \"Hj. Endang Sri Lestari\", \"order_number\": 1}, {\"bio\": \"\", \"photo\": \"/themes/wayang/asset/jawa-hitam-w.jpg\", \"gender\": \"wanita\", \"nickname\": \"Raras\", \"full_name\": \"Raras Sekar Ayu\", \"instagram\": \"USERNAME\", \"child_order\": \"Kedua\", \"father_name\": \"H. Bambang Sunarto\", \"mother_name\": \"Hj. Wahyu Ningsih\", \"order_number\": 2}], \"love_stories\": [{\"title\": \"Awal Bertemu\", \"sort_order\": 0, \"description\": \"Kami diperkenalkan oleh seorang sahabat di Yogyakarta pada akhir tahun 2023. Sejak pertemuan pertama itu, kami merasa memiliki kecocokan visi hidup yang sama.\"}, {\"title\": \"Komitmen Bersama\", \"sort_order\": 1, \"description\": \"Setelah satu tahun menjalin komunikasi yang intens, kami sepakat untuk melangkah ke jenjang yang lebih serius dengan memohon restu kedua orang tua.\"}, {\"title\": \"Khitbah (Lamaran)\", \"sort_order\": 2, \"description\": \"Pada pertengahan tahun 2025, Bimo bersama keluarga besar secara resmi datang meminang Raras di hadapan kedua orang tuanya.\"}], \"bank_accounts\": [{\"bank_name\": \"BCA\", \"sort_order\": 0, \"account_name\": \"Bimo Wicaksono\", \"account_number\": \"1234567890\"}, {\"bank_name\": \"Mandiri\", \"sort_order\": 1, \"account_name\": \"Raras Sekar Ayu\", \"account_number\": \"0987654321\"}]}','wayang/style.css',1,1,0,1,1,15,'2026-05-23 08:30:52','2026-05-23 08:30:52',0,0);
/*!40000 ALTER TABLE `themes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('super_admin','admin','user') COLLATE utf8mb4_unicode_ci DEFAULT 'user',
  `reseller_id` bigint unsigned DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `onboarding_step` tinyint NOT NULL DEFAULT '0' COMMENT '0=belum mulai, 1=verification, 2=link, 3=profile, 4=events, 5=template, 6=selesai',
  `locale` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'id' COMMENT 'id, en',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `otp_code` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `otp_expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_reseller_id_foreign` (`reseller_id`),
  CONSTRAINT `users_reseller_id_foreign` FOREIGN KEY (`reseller_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Administrator','admin@groovy.com','2026-03-08 08:24:46','$2y$12$UXdJYX31HR0ka8.8EGKQZu5sAsrhrE/jCXofJF9TlkEC1fhSu0/Fq',NULL,NULL,'super_admin',NULL,1,6,'id','RKgY2e8gIYlAjLCRJgaqCDpITL3UtVgTrE5p8bQjNaZCKNOAdF1mnB5nmyVp',NULL,NULL,'2026-03-08 08:24:46','2026-03-08 08:24:46'),(2,'Mira Rahayu','mira@test.com','2026-03-08 08:24:47','$2y$12$NGRJ2ZvX1BKKxWKl939nkuy2PTslg3H7vd5q4MQ8okF1qw5AIZz5O','081234567890',NULL,'user',6,1,6,'id','t9UOIf65VYOahIq6LfdEAZJ50LmfHU1em9dqLlWMahJJoYTwFY77CSDS3ETM',NULL,NULL,'2026-03-08 08:24:47','2026-03-12 12:17:58'),(3,'Andi Setiawan','andi@test.com','2026-03-08 08:24:48','$2y$12$8l4Wm82UnET27PIVt6Y3Se/eSJ9bLw32zhYoyrrrM3iK112DaElcm','089876543210',NULL,'user',6,1,6,'id','kSUXUYAmORDJ5jqaag9RWudisTfyeegDqHGcFcrrDfZwWw0Ky69whM2dtof9',NULL,NULL,'2026-03-08 08:24:48','2026-03-12 12:17:58'),(4,'M. Akrom Adabi','oke@gmail.com',NULL,'$2y$12$tGhFh0Bt3ABmQAV5vp1bJOCUPuK4Q7G7ifMt77cTnIhS2GspNgROW',NULL,NULL,'user',6,1,0,'id',NULL,NULL,NULL,'2026-03-09 07:54:51','2026-03-12 12:17:58'),(5,'bella','salsaviabella@gmail.com','2026-03-09 10:40:57','$2y$12$g.j8r8zzmHGJpbWyHpCGuuLOL5fpOW95OSBWLLKo6KQBOuJhEN0RC','083132211830',NULL,'user',6,1,6,'id',NULL,NULL,NULL,'2026-03-09 10:17:31','2026-03-12 12:17:58'),(6,'Test Reseller','reseller@test.com','2026-03-12 11:53:46','$2y$12$nmeAKrDFJRcNhjqfDbiVsO/qDqS7xdT4EaBREE95Sh.n8ZgozUZJ.','08123456789',NULL,'admin',NULL,1,6,'id','VUdTzV2KIfJJAj3hkrvqfym3tFR5HwMIKGVZV5DlITt0AQjvoPpVuAMc0cb5',NULL,NULL,'2026-03-12 11:04:45','2026-03-12 11:53:46'),(8,'Demo Account','demo@undangan.com',NULL,'$2y$12$dq0lE4qOji.IiBzwRdyDO.w7lbgmFiif2d5OPVOxpy1/2Ob.GssLy','081234567890',NULL,'user',NULL,1,6,'id','HnWmQRqC6OMp8Ut23KxevAUFoaHTT85Tq5Bridw9idlfMc3x96SrYjXxsoBE','$2y$12$qxNCwz/6d9BWEdDmzsH7n.G0sD9d1UFvMY60bGxtRaicBASQzGFCa','2026-03-18 13:00:02','2026-03-18 12:52:31','2026-03-18 12:55:02');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `whatsapp_logs`
--

DROP TABLE IF EXISTS `whatsapp_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `whatsapp_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `invitation_id` bigint unsigned NOT NULL,
  `guest_id` bigint unsigned NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','sent','failed','delivered') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `response` json DEFAULT NULL,
  `sent_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `whatsapp_logs_invitation_id_foreign` (`invitation_id`),
  KEY `whatsapp_logs_guest_id_foreign` (`guest_id`),
  CONSTRAINT `whatsapp_logs_guest_id_foreign` FOREIGN KEY (`guest_id`) REFERENCES `guests` (`id`) ON DELETE CASCADE,
  CONSTRAINT `whatsapp_logs_invitation_id_foreign` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `whatsapp_logs`
--

LOCK TABLES `whatsapp_logs` WRITE;
/*!40000 ALTER TABLE `whatsapp_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `whatsapp_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishes`
--

DROP TABLE IF EXISTS `wishes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `invitation_id` bigint unsigned NOT NULL,
  `guest_id` bigint unsigned DEFAULT NULL,
  `sender_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_visible` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `wishes_invitation_id_foreign` (`invitation_id`),
  KEY `wishes_guest_id_foreign` (`guest_id`),
  CONSTRAINT `wishes_guest_id_foreign` FOREIGN KEY (`guest_id`) REFERENCES `guests` (`id`) ON DELETE SET NULL,
  CONSTRAINT `wishes_invitation_id_foreign` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishes`
--

LOCK TABLES `wishes` WRITE;
/*!40000 ALTER TABLE `wishes` DISABLE KEYS */;
INSERT INTO `wishes` VALUES (57,1,NULL,'Ahmad Saputra','Selamat menempuh hidup baru Bimo & Raras! Semoga sakinah mawaddah wa rahmah selalu.',1,'2026-05-23 08:37:48','2026-05-23 08:37:48'),(58,1,NULL,'Siti Aminah','Selamat berbahagia ya! Berkah dunia akhirat untuk kedua mempelai.',1,'2026-05-23 08:37:48','2026-05-23 08:37:48');
/*!40000 ALTER TABLE `wishes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `withdrawals`
--

DROP TABLE IF EXISTS `withdrawals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `withdrawals` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `reseller_id` bigint unsigned NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `status` enum('pending','approved','rejected','transferred') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `admin_notes` text COLLATE utf8mb4_unicode_ci,
  `transferred_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `withdrawals_reseller_id_status_index` (`reseller_id`,`status`),
  CONSTRAINT `withdrawals_reseller_id_foreign` FOREIGN KEY (`reseller_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `withdrawals`
--

LOCK TABLES `withdrawals` WRITE;
/*!40000 ALTER TABLE `withdrawals` DISABLE KEYS */;
/*!40000 ALTER TABLE `withdrawals` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-23 22:42:40
