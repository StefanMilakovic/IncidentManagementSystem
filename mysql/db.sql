-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: auth_db
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `role` enum('MODERATOR','USER') NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'stefan.milakovic@student.etf.unibl.org','MODERATOR','Stefan Milaković'),(2,'stefanmilakovic23@gmail.com','USER','Stefan Milaković');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-08 21:07:32
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: moderation_db
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `incident_status_history`
--

DROP TABLE IF EXISTS `incident_status_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incident_status_history` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `incident_id` bigint NOT NULL,
  `status` enum('REPORTED','PENDING','APPROVED','REJECTED') NOT NULL,
  `status_change_time` datetime DEFAULT NULL,
  `moderator_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incident_status_history`
--

LOCK TABLES `incident_status_history` WRITE;
/*!40000 ALTER TABLE `incident_status_history` DISABLE KEYS */;
INSERT INTO `incident_status_history` VALUES (1,4,'PENDING','2026-02-06 16:48:55',1),(2,38,'APPROVED','2026-02-06 16:49:09',1),(3,48,'APPROVED','2026-02-06 16:49:19',1),(4,51,'APPROVED','2026-02-06 21:05:24',1),(5,52,'APPROVED','2026-02-06 21:05:31',1),(6,2,'APPROVED','2026-02-06 21:09:20',1);
/*!40000 ALTER TABLE `incident_status_history` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-08 21:07:32
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: incident_db
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `incident`
--

DROP TABLE IF EXISTS `incident`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incident` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `type` enum('FIRE','FLOOD','ACCIDENT','CRIME') NOT NULL,
  `subtype` enum('CAR_ACCIDENT','BUILDING_FIRE','ROBBERY','ASSAULT') DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `description` varchar(1000) NOT NULL,
  `reported_at` datetime DEFAULT NULL,
  `last_updated` datetime DEFAULT NULL,
  `status` enum('REPORTED','PENDING','APPROVED','REJECTED','RESOLVED','DUPLICATE','CANCELED') NOT NULL DEFAULT 'REPORTED',
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `radius` double DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `zipcode` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incident`
--

LOCK TABLES `incident` WRITE;
/*!40000 ALTER TABLE `incident` DISABLE KEYS */;
INSERT INTO `incident` VALUES (1,'FIRE','CAR_ACCIDENT',43.845168987743875,18.359562568530542,'Test incident description 0','2026-01-25 20:56:12','2026-02-06 14:31:27','APPROVED','Maršala Tita 8','Sarajevo','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','71000'),(2,'FLOOD',NULL,43.341005566661124,17.80462295309022,'Test incident description 1','2026-01-25 20:56:12','2026-02-06 21:09:20','APPROVED','Braće Fejića 21','Mostar','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','88000'),(3,'ACCIDENT','ROBBERY',44.77008290366167,17.189447653036343,'Test incident description 2','2026-01-25 20:56:12',NULL,'APPROVED','Kralja Petra I Karađorđevića 32','Banja Luka','Bosna i Hercegovina',1000,'Republika Srpska','78000'),(4,'CRIME',NULL,44.20641267523674,17.90144287164794,'Test incident description 3','2026-01-25 20:56:12','2026-02-06 16:48:55','PENDING','Zmaja od Bosne 64','Zenica','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','72000'),(5,'FIRE','CAR_ACCIDENT',44.53744643067845,18.67263188593331,'Test incident description 4','2026-01-25 20:56:12',NULL,'REPORTED','Armije BiH 45','Tuzla','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','75000'),(6,'FLOOD',NULL,43.84707141732839,18.355188153459743,'Test incident description 5','2026-01-25 20:56:12',NULL,'REPORTED','Maršala Tita 8','Sarajevo','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','71000'),(7,'ACCIDENT','ROBBERY',43.34204912261228,17.811199444204696,'Test incident description 6','2026-01-25 20:56:12',NULL,'REPORTED','Braće Fejića 21','Mostar','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','88000'),(8,'CRIME',NULL,44.77053409918473,17.192213716779616,'Test incident description 7','2026-01-25 20:56:12',NULL,'REPORTED','Kralja Petra I Karađorđevića 32','Banja Luka','Bosna i Hercegovina',1000,'Republika Srpska','78000'),(9,'FIRE','CAR_ACCIDENT',44.203885879284435,17.903754256732793,'Test incident description 8','2026-01-25 20:56:12','2026-02-06 14:31:39','APPROVED','Zmaja od Bosne 64','Zenica','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','72000'),(10,'FLOOD',NULL,44.53440638999672,18.675320173290952,'Test incident description 9','2026-01-25 20:56:12',NULL,'REPORTED','Armije BiH 45','Tuzla','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','75000'),(11,'ACCIDENT','ROBBERY',43.84810940171976,18.356917361619963,'Test incident description 10','2026-01-25 20:56:12',NULL,'REPORTED','Maršala Tita 8','Sarajevo','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','71000'),(12,'CRIME',NULL,43.34575602363156,17.80846732177509,'Test incident description 11','2026-01-25 20:56:12',NULL,'REPORTED','Braće Fejića 21','Mostar','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','88000'),(13,'FIRE','CAR_ACCIDENT',44.77149587899936,17.1926091284137,'Test incident description 12','2026-01-25 20:56:12',NULL,'REPORTED','Kralja Petra I Karađorđevića 32','Banja Luka','Bosna i Hercegovina',1000,'Republika Srpska','78000'),(14,'FLOOD',NULL,44.20264061691184,17.90259182920926,'Test incident description 13','2026-01-25 20:56:12',NULL,'REPORTED','Zmaja od Bosne 64','Zenica','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','72000'),(15,'ACCIDENT','ROBBERY',44.53557546532883,18.675722866381715,'Test incident description 14','2026-01-25 20:56:12',NULL,'REPORTED','Armije BiH 45','Tuzla','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','75000'),(16,'CRIME',NULL,43.84883333539788,18.353184900853975,'Test incident description 15','2026-01-25 20:56:12',NULL,'REPORTED','Maršala Tita 8','Sarajevo','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','71000'),(17,'FIRE','CAR_ACCIDENT',43.34364106263668,17.810976212227253,'Test incident description 16','2026-01-25 20:56:12',NULL,'REPORTED','Braće Fejića 21','Mostar','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','88000'),(18,'FLOOD',NULL,44.77335128511422,17.18795385903018,'Test incident description 17','2026-01-25 20:56:12',NULL,'REPORTED','Kralja Petra I Karađorđevića 32','Banja Luka','Bosna i Hercegovina',1000,'Republika Srpska','78000'),(19,'ACCIDENT','ROBBERY',44.20379838974882,17.90282520279765,'Test incident description 18','2026-01-25 20:56:12',NULL,'REPORTED','Zmaja od Bosne 64','Zenica','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','72000'),(20,'CRIME',NULL,44.53673433565352,18.667684186889726,'Test incident description 19','2026-01-25 20:56:12',NULL,'REPORTED','Armije BiH 45','Tuzla','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','75000'),(21,'FIRE','CAR_ACCIDENT',43.8473442284062,18.35303000111761,'Test incident description 20','2026-01-25 20:56:12',NULL,'REPORTED','Maršala Tita 8','Sarajevo','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','71000'),(22,'FLOOD',NULL,43.34486293843013,17.804947788307796,'Test incident description 21','2026-01-25 20:56:12',NULL,'REPORTED','Braće Fejića 21','Mostar','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','88000'),(23,'ACCIDENT','ROBBERY',44.77024614063942,17.195802365800624,'Test incident description 22','2026-01-25 20:56:12',NULL,'REPORTED','Kralja Petra I Karađorđevića 32','Banja Luka','Bosna i Hercegovina',1000,'Republika Srpska','78000'),(24,'CRIME',NULL,44.20449327883348,17.901581247149647,'Test incident description 23','2026-01-25 20:56:12',NULL,'REPORTED','Zmaja od Bosne 64','Zenica','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','72000'),(25,'FIRE','CAR_ACCIDENT',44.54034104862372,18.674443593084018,'Test incident description 24','2026-01-25 20:56:12',NULL,'REPORTED','Armije BiH 45','Tuzla','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','75000'),(26,'FLOOD',NULL,43.84668012698692,18.360858359717295,'Test incident description 25','2026-01-25 20:56:12',NULL,'REPORTED','Maršala Tita 8','Sarajevo','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','71000'),(27,'ACCIDENT','ROBBERY',43.33998004944144,17.811866435068083,'Test incident description 26','2026-01-25 20:56:12','2026-02-06 14:32:53','REJECTED','Braće Fejića 21','Mostar','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','88000'),(28,'CRIME',NULL,44.77135774648178,17.187989953159253,'Test incident description 27','2026-01-25 20:56:12',NULL,'REPORTED','Kralja Petra I Karađorđevića 32','Banja Luka','Bosna i Hercegovina',1000,'Republika Srpska','78000'),(29,'FIRE','CAR_ACCIDENT',44.20481070165459,17.899424370734632,'Test incident description 28','2026-01-25 20:56:12',NULL,'REPORTED','Zmaja od Bosne 64','Zenica','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','72000'),(30,'FLOOD',NULL,44.53499770513802,18.673962967346448,'Test incident description 29','2026-01-25 20:56:12',NULL,'REPORTED','Armije BiH 45','Tuzla','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','75000'),(31,'ACCIDENT','ROBBERY',43.85012492740196,18.358906084733007,'Test incident description 30','2026-01-25 20:56:12',NULL,'REPORTED','Maršala Tita 8','Sarajevo','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','71000'),(32,'CRIME',NULL,43.34309800233655,17.811686380974407,'Test incident description 31','2026-01-25 20:56:12',NULL,'REPORTED','Braće Fejića 21','Mostar','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','88000'),(33,'FIRE','CAR_ACCIDENT',44.774774023610895,17.19277710923481,'Test incident description 32','2026-01-25 20:56:12',NULL,'REPORTED','Kralja Petra I Karađorđevića 32','Banja Luka','Bosna i Hercegovina',1000,'Republika Srpska','78000'),(34,'FLOOD',NULL,44.20759988902246,17.90192694808329,'Test incident description 33','2026-01-25 20:56:12',NULL,'REPORTED','Zmaja od Bosne 64','Zenica','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','72000'),(35,'ACCIDENT','ROBBERY',44.54046120194578,18.670607930574462,'Test incident description 34','2026-01-25 20:56:12',NULL,'REPORTED','Armije BiH 45','Tuzla','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','75000'),(36,'CRIME',NULL,43.849944742535016,18.356771138099795,'Test incident description 35','2026-01-25 20:56:12',NULL,'REPORTED','Maršala Tita 8','Sarajevo','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','71000'),(37,'FIRE','CAR_ACCIDENT',43.34261986766498,17.80805372575712,'Test incident description 36','2026-01-25 20:56:12',NULL,'REPORTED','Braće Fejića 21','Mostar','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','88000'),(38,'FLOOD',NULL,44.77533552821922,17.192423213763927,'Test incident description 37','2026-01-25 20:56:12','2026-02-06 16:49:09','APPROVED','Kralja Petra I Karađorđevića 32','Banja Luka','Bosna i Hercegovina',1000,'Republika Srpska','78000'),(39,'ACCIDENT','ROBBERY',44.208480399812984,17.903420318634314,'Test incident description 38','2026-01-25 20:56:12',NULL,'REPORTED','Zmaja od Bosne 64','Zenica','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','72000'),(40,'CRIME',NULL,44.53427263893266,18.670415375349826,'Test incident description 39','2026-01-25 20:56:12',NULL,'REPORTED','Armije BiH 45','Tuzla','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','75000'),(41,'FIRE','CAR_ACCIDENT',43.84993499577252,18.35205222178371,'Test incident description 40','2026-01-25 20:56:12',NULL,'REPORTED','Maršala Tita 8','Sarajevo','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','71000'),(42,'FLOOD',NULL,43.34121622173821,17.80817129798214,'Test incident description 41','2026-01-25 20:56:13',NULL,'REPORTED','Braće Fejića 21','Mostar','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','88000'),(43,'ACCIDENT','ROBBERY',44.773974239995866,17.194191639823085,'Test incident description 42','2026-01-25 20:56:13',NULL,'REPORTED','Kralja Petra I Karađorđevića 32','Banja Luka','Bosna i Hercegovina',1000,'Republika Srpska','78000'),(44,'CRIME',NULL,44.2054047523627,17.9008176576824,'Test incident description 43','2026-01-25 20:56:13',NULL,'REPORTED','Zmaja od Bosne 64','Zenica','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','72000'),(45,'FIRE','CAR_ACCIDENT',44.539594020362344,18.671078063078287,'Test incident description 44','2026-01-25 20:56:13',NULL,'REPORTED','Armije BiH 45','Tuzla','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','75000'),(46,'FLOOD',NULL,43.85014107295531,18.360284150529797,'Test incident description 45','2026-01-25 20:56:13',NULL,'REPORTED','Maršala Tita 8','Sarajevo','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','71000'),(47,'ACCIDENT','ROBBERY',43.34673561567604,17.80585381421088,'Test incident description 46','2026-01-25 20:56:13',NULL,'REPORTED','Braće Fejića 21','Mostar','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','88000'),(48,'CRIME',NULL,44.77548372738023,17.190195228497522,'Test incident description 47','2026-01-25 20:56:13','2026-02-06 16:49:19','APPROVED','Kralja Petra I Karađorđevića 32','Banja Luka','Bosna i Hercegovina',1000,'Republika Srpska','78000'),(49,'FIRE','CAR_ACCIDENT',44.20213357024283,17.903595453982124,'Test incident description 48','2026-01-25 20:56:13',NULL,'REPORTED','Zmaja od Bosne 64','Zenica','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','72000'),(50,'FLOOD',NULL,44.539302998339,18.670510675900605,'Test incident description 49','2026-01-25 20:56:13',NULL,'REPORTED','Armije BiH 45','Tuzla','Bosna i Hercegovina',1000,'Federacija Bosne i Hercegovine','75000'),(51,'ACCIDENT',NULL,44.76668663502297,17.187101840972904,'test etf','2026-02-06 13:51:57','2026-02-06 21:05:24','APPROVED',NULL,NULL,NULL,0,NULL,NULL),(52,'ACCIDENT','CAR_ACCIDENT',44.81594145542591,20.46110808849335,'test slavija','2026-02-06 15:18:39','2026-02-06 21:05:31','APPROVED',NULL,NULL,NULL,0,NULL,NULL);
/*!40000 ALTER TABLE `incident` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `incident_image`
--

DROP TABLE IF EXISTS `incident_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incident_image` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `image_url` varchar(255) DEFAULT NULL,
  `incident_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_incident` (`incident_id`),
  CONSTRAINT `fk_incident` FOREIGN KEY (`incident_id`) REFERENCES `incident` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
