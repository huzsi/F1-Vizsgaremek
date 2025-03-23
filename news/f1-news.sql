-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: localhost
-- Létrehozás ideje: 2025. Már 23. 21:25
-- Kiszolgáló verziója: 10.4.28-MariaDB
-- PHP verzió: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `f1-news`
--
CREATE DATABASE IF NOT EXISTS `f1-news` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;
USE `f1-news`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `circuitDatas`
--
-- Létrehozva: 2025. Már 23. 18:30
-- Utolsó frissítés: 2025. Már 23. 18:38
--

CREATE TABLE `circuitDatas` (
  `id` varchar(5) DEFAULT NULL,
  `firstGP` year(4) DEFAULT NULL,
  `lapNumber` int(11) DEFAULT NULL,
  `length` double DEFAULT NULL,
  `raceDistance` double DEFAULT NULL,
  `record` varchar(255) DEFAULT NULL,
  `driver` varchar(5) DEFAULT NULL,
  `recordYear` year(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- TÁBLA KAPCSOLATAI `circuitDatas`:
--   `id`
--       `raceNames` -> `id`
--

--
-- A tábla adatainak kiíratása `circuitDatas`
--

INSERT INTO `circuitDatas` (`id`, `firstGP`, `lapNumber`, `length`, `raceDistance`, `record`, `driver`, `recordYear`) VALUES
('au', '1996', 58, 5.278, 306.124, '1:19.813', 'LEC', '2024'),
('cn', '2004', 56, 5.451, 305.066, '1:32.238', 'MSC', '2004'),
('jp', '1987', 53, 5.807, 307.471, '1:30.983', 'HAM', '2019'),
('bh', '2004', 57, 5.412, 308.238, '1:38.447', 'DLR', '2005'),
('sa', '2021', 50, 6.174, 308.405, '1:30.734', 'HAM', '2021'),
('mi', '2022', 57, 5.412, 308.326, '1:29.708', 'VER', '2023'),
('er', '1980', 63, 4.909, 309.049, '1:15.484', 'HAM', '2020'),
('mc', '1950', 78, 3.337, 260.286, '1:12.909', 'HAM', '2021'),
('es', '1991', 66, 4.657, 307.236, '1:16.330', 'VER', '2023'),
('at', '1970', 71, 4.318, 306.452, '1:05.619', 'SAI', '2020'),
('gb', '1950', 52, 5.891, 306.198, '1:27.097', 'VER', '2020'),
('be', '1950', 44, 7.004, 308.052, '1:44.701', 'PER', '2024'),
('hu', '1986', 70, 4.381, 306.63, '1:16.627', 'HAM', '2020'),
('nl', '1952', 72, 4.259, 306.587, '1:11.097', 'HAM', '2021'),
('it', '1950', 53, 5.793, 306.72, '1:21.046', 'BAR', '2004'),
('az', '2016', 51, 6.003, 306.049, '1:43.009', 'LEC', '2019'),
('sg', '2018', 62, 4.94, 306.143, '1:34.486', 'RIC', '2024'),
('us', '2012', 56, 5.513, 308.405, '1:36.169', 'LEC', '2019'),
('mx', '1963', 71, 4.304, 305.354, '1:17.774', 'BOT', '2021'),
('br', '1973', 71, 4.309, 305.879, '1:10.540', 'BOT', '2018'),
('lv', '2023', 50, 6.201, 309.958, '1:34.876', 'NOR', '2024'),
('qa', '2021', 57, 5.419, 308.611, '1:22.384', 'NOR', '2024'),
('ae', '2009', 58, 5.281, 306.183, '1:25.637', 'MAG', '2024'),
('ca', '1978', 70, 4.361, 305.27, '1:13.078', 'BOT', '2019');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `constructorNames`
--
-- Létrehozva: 2025. Már 23. 18:30
-- Utolsó frissítés: 2025. Már 23. 18:38
--

CREATE TABLE `constructorNames` (
  `constructorId` int(11) NOT NULL,
  `constructorName` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- TÁBLA KAPCSOLATAI `constructorNames`:
--

--
-- A tábla adatainak kiíratása `constructorNames`
--

INSERT INTO `constructorNames` (`constructorId`, `constructorName`) VALUES
(1, 'McLaren'),
(2, 'Ferrari'),
(3, 'Red Bull Racing'),
(4, 'Mercedes'),
(5, 'Aston Martin'),
(6, 'Alpine'),
(7, 'Racing Bulls'),
(8, 'Haas'),
(9, 'Williams'),
(10, 'Kick Sauber');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `driverNames`
--
-- Létrehozva: 2025. Már 23. 18:30
-- Utolsó frissítés: 2025. Már 23. 18:38
--

CREATE TABLE `driverNames` (
  `driverId` int(11) NOT NULL,
  `driverName` varchar(255) DEFAULT NULL,
  `constructorId` int(11) DEFAULT NULL,
  `constructor` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- TÁBLA KAPCSOLATAI `driverNames`:
--   `constructorId`
--       `constructorNames` -> `constructorId`
--

--
-- A tábla adatainak kiíratása `driverNames`
--

INSERT INTO `driverNames` (`driverId`, `driverName`, `constructorId`, `constructor`) VALUES
(1, 'Oscar Piastri', 1, 'mclaren'),
(2, 'Lando Norris', 1, 'mclaren'),
(3, 'Charles Leclerc', 2, 'ferrari'),
(4, 'Lewis Hamilton', 2, 'ferrari'),
(5, 'Max Verstappen', 3, 'redbull'),
(6, 'Liam Lawson', 3, 'redbull'),
(7, 'George Russell', 4, 'mercedes'),
(8, 'Andrea Kimi Antonelli', 4, 'mercedes'),
(9, 'Lance Stroll', 5, 'astonmartin'),
(10, 'Fernando Alonso', 5, 'astonmartin'),
(11, 'Pierre Gasly', 6, 'alpine'),
(12, 'Jack Doohan', 6, 'alpine'),
(13, 'Isack Hadjar', 7, 'racingbulls'),
(14, 'Yuki Tsunoda', 7, 'racingbulls'),
(15, 'Esteban Ocon', 8, 'haas'),
(16, 'Oliver Bearman', 8, 'haas'),
(17, 'Alexander Albon', 9, 'williams'),
(18, 'Carlos Sainz', 9, 'williams'),
(19, 'Nico Hulkeberg', 10, 'sauber'),
(20, 'Gabriel Bortoleto', 10, 'sauber');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `forumTopics`
--
-- Létrehozva: 2025. Már 23. 20:21
-- Utolsó frissítés: 2025. Már 23. 20:23
--

CREATE TABLE `forumTopics` (
  `topicId` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `topicTitle` varchar(255) DEFAULT NULL,
  `topicContent` text DEFAULT NULL,
  `date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- TÁBLA KAPCSOLATAI `forumTopics`:
--   `userId`
--       `user` -> `id`
--

--
-- A tábla adatainak kiíratása `forumTopics`
--

INSERT INTO `forumTopics` (`topicId`, `userId`, `topicTitle`, `topicContent`, `date`) VALUES
(1, 0, 'Australia', 'Welcome to the official discussion topic for race! Share your thoughts, opinions, and experiences about the race events.', '2025-03-19 13:04:17'),
(3, 1, 'Leclerc and Hamilton DSQ', 'What do you think, was the disqualification of the two pilots justified?', '2025-03-23 20:22:41'),
(4, 0, 'China', 'Welcome to the official discussion topic for race! Share your thoughts, opinions, and experiences about the race events.', '2025-03-23 20:23:05');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `raceDates`
--
-- Létrehozva: 2025. Már 23. 18:30
-- Utolsó frissítés: 2025. Már 23. 18:32
--

CREATE TABLE `raceDates` (
  `id` varchar(5) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `event1` datetime DEFAULT NULL,
  `event2` datetime DEFAULT NULL,
  `event3` datetime DEFAULT NULL,
  `event4` datetime DEFAULT NULL,
  `event5` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- TÁBLA KAPCSOLATAI `raceDates`:
--   `id`
--       `raceNames` -> `id`
--

--
-- A tábla adatainak kiíratása `raceDates`
--

INSERT INTO `raceDates` (`id`, `type`, `event1`, `event2`, `event3`, `event4`, `event5`) VALUES
('ae', 1, '2025-12-05 10:30:00', '2025-12-05 14:00:00', '2025-12-06 11:30:00', '2025-12-06 15:00:00', '2025-12-07 14:00:00'),
('at', 1, '2025-06-27 13:30:00', '2025-06-27 17:00:00', '2025-06-28 12:30:00', '2025-06-28 16:00:00', '2025-06-29 15:00:00'),
('au', 1, '2025-03-14 02:30:00', '2025-03-14 06:00:00', '2025-03-15 02:30:00', '2025-03-15 06:00:00', '2025-03-16 05:00:00'),
('az', 1, '2025-09-19 10:30:00', '2025-09-19 14:00:00', '2025-09-20 10:30:00', '2025-09-20 14:00:00', '2025-09-21 13:00:00'),
('be', 2, '2025-07-25 12:30:00', '2025-07-25 16:30:00', '2025-07-26 12:00:00', '2025-07-26 16:00:00', '2025-07-27 15:00:00'),
('bh', 1, '2025-04-11 13:30:00', '2025-04-11 17:00:00', '2025-04-12 14:30:00', '2025-04-12 18:00:00', '2025-04-13 17:00:00'),
('br', 2, '2025-11-07 15:30:00', '2025-11-07 19:30:00', '2025-11-08 15:00:00', '2025-11-08 19:00:00', '2025-11-09 18:00:00'),
('ca', 1, '2025-06-13 19:30:00', '2025-06-13 23:00:00', '2025-06-14 18:30:00', '2025-06-14 22:00:00', '2025-06-15 20:00:00'),
('cn', 2, '2025-03-21 04:30:00', '2025-03-21 08:30:00', '2025-03-22 04:00:00', '2025-03-22 08:00:00', '2025-03-23 08:00:00'),
('er', 1, '2025-05-16 13:30:00', '2025-05-16 17:00:00', '2025-05-17 12:30:00', '2025-05-17 16:00:00', '2025-05-18 15:00:00'),
('es', 1, '2025-05-30 13:30:00', '2025-05-30 17:00:00', '2025-05-31 12:30:00', '2025-05-31 16:00:00', '2025-06-01 15:00:00'),
('gb', 1, '2025-07-04 13:30:00', '2025-07-04 17:00:00', '2025-07-05 12:30:00', '2025-07-05 16:00:00', '2025-07-06 16:00:00'),
('hu', 1, '2025-08-01 13:30:00', '2025-08-01 17:00:00', '2025-08-02 12:30:00', '2025-08-02 16:00:00', '2025-08-03 15:00:00'),
('it', 1, '2025-09-05 13:30:00', '2025-09-05 17:00:00', '2025-09-06 12:30:00', '2025-09-06 16:00:00', '2025-09-07 15:00:00'),
('jp', 1, '2025-04-04 04:30:00', '2025-04-04 08:00:00', '2025-04-05 04:30:00', '2025-04-05 08:00:00', '2025-04-06 07:00:00'),
('lv', 1, '2025-11-21 01:30:00', '2025-11-21 05:00:00', '2025-11-22 01:30:00', '2025-11-22 05:00:00', '2025-11-23 05:00:00'),
('mc', 1, '2025-05-23 13:30:00', '2025-05-23 17:00:00', '2025-05-24 12:30:00', '2025-05-24 16:00:00', '2025-05-25 15:00:00'),
('mi', 2, '2025-05-02 18:30:00', '2025-05-02 22:30:00', '2025-05-03 18:30:00', '2025-05-03 22:00:00', '2025-05-04 22:00:00'),
('mx', 1, '2025-10-24 20:30:00', '2025-10-24 00:00:00', '2025-10-25 19:30:00', '2025-10-25 23:00:00', '2025-10-26 21:00:00'),
('nl', 1, '2025-08-29 12:30:00', '2025-08-29 16:00:00', '2025-08-30 11:30:00', '2025-08-30 15:00:00', '2025-08-31 15:00:00'),
('qa', 2, '2025-11-28 14:30:00', '2025-11-28 18:30:00', '2025-11-29 15:00:00', '2025-11-29 19:00:00', '2025-11-30 17:00:00'),
('sa', 1, '2025-04-18 15:30:00', '2025-04-18 19:00:00', '2025-04-19 15:30:00', '2025-04-19 19:00:00', '2025-04-20 19:00:00'),
('sg', 1, '2025-10-03 11:30:00', '2025-10-03 15:00:00', '2025-10-04 11:30:00', '2025-10-04 15:00:00', '2025-10-05 14:00:00'),
('us', 2, '2025-10-17 19:30:00', '2025-10-17 23:30:00', '2025-10-18 19:00:00', '2025-10-18 23:00:00', '2025-10-19 21:00:00');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `raceNames`
--
-- Létrehozva: 2025. Már 23. 18:30
-- Utolsó frissítés: 2025. Már 23. 18:32
--

CREATE TABLE `raceNames` (
  `raceNumber` int(11) NOT NULL,
  `id` varchar(5) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `trackName` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- TÁBLA KAPCSOLATAI `raceNames`:
--

--
-- A tábla adatainak kiíratása `raceNames`
--

INSERT INTO `raceNames` (`raceNumber`, `id`, `name`, `fullname`, `trackName`) VALUES
(25, 'ae', 'Abu Dhabi', 'FORMULA 1 ETIHAD AIRWAYS ABU DHABI GRAND PRIX 2025', 'Yas Marina Circuit'),
(11, 'at', 'Austria', 'FORMULA 1 MSC CRUISES AUSTRIAN GRAND PRIX 2025', 'Red Bull Ring'),
(1, 'au', 'Australia', 'FORMULA 1 AUSTRALIAN GRAND PRIX 2025', 'Albert Park Grand Prix Circuit'),
(17, 'az', 'Azerbajan', 'FORMULA 1 QATAR AIRWAYS AZERBAIJAN GRAND PRIX 2025', 'Baku City Circuit'),
(13, 'be', 'Belgium', 'FORMULA 1 BELGIAN GRAND PRIX 2025', 'Circuit de Spa-Francorchamps'),
(4, 'bh', 'Bahrain', 'FORMULA 1 BAHRAIN GRAND PRIX 2025', 'Bahrain International Circuit'),
(21, 'br', 'Brazil', 'FORMULA 1 MSC CRUISES GRANDE PRÊMIO DE SÃO PAULO 2025', 'Autódromo José Carlos Pace'),
(10, 'ca', 'Canada', 'FORMULA 1 PIRELLI GRAND PRIX DU CANADA 2025', 'Circuit Gilles-Villeneuve'),
(2, 'cn', 'China', 'FORMULA 1 HEINEKEN CHINESE GRAND PRIX 2025', 'Shanghai International Circuit'),
(7, 'er', 'Emilia-Romagna', 'FORMULA 1 AWS GRAN PREMIO DEL MADE IN ITALY E DELL\'EMILIA-ROMAGNA 2025', 'Autodromo Internazionale Enzo e Dino Ferrari'),
(9, 'es', 'Spain', 'FORMULA 1 ARAMCO GRAN PREMIO DE ESPAÑA 2025', 'Circuit de Barcelona-Catalunya'),
(12, 'gb', 'Great-Britain', 'FORMULA 1 QATAR AIRWAYS BRITISH GRAND PRIX 2025', 'Silverstone Circuit\r\n'),
(14, 'hu', 'Hungary', 'FORMULA 1 LENOVO HUNGARIAN GRAND PRIX 2025', 'Hungaroring'),
(16, 'it', 'Italy', 'FORMULA 1 PIRELLI GRAN PREMIO D’ITALIA 2025', 'Autodromo Nazionale Monza'),
(3, 'jp', 'Japan', 'FORMULA 1 HEINEKEN CHINESE GRAND PRIX 2025', 'Suzuka Circuit'),
(22, 'lv', 'Las Vegas', 'FORMULA 1 HEINEKEN SILVER LAS VEGAS GRAND PRIX 2025', 'Las Vegas Strip Circuit'),
(8, 'mc', 'Monaco', 'FORMULA 1 GRAND PRIX DE MONACO 2025', 'Circuit de Monaco'),
(6, 'mi', 'Miami', 'FORMULA 1 CRYPTO.COM MIAMI GRAND PRIX 2025', 'Miami International Autodrome'),
(20, 'mx', 'Mexico', 'FORMULA 1 GRAN PREMIO DE LA CIUDAD DE MÉXICO 2025', 'Autódromo Hermanos Rodríguez'),
(15, 'nl', 'Netherland', 'FORMULA 1 HEINEKEN DUTCH GRAND PRIX 2025', 'Circuit Zandvoort'),
(23, 'qa', 'Qatar', 'FORMULA 1 QATAR AIRWAYS QATAR GRAND PRIX 2025', 'Lusail International Circuit'),
(5, 'sa', 'Saudi-Arabia', 'FORMULA 1 STC SAUDI ARABIAN GRAND PRIX 2025', 'Jeddah Corniche Circuit'),
(18, 'sg', 'Singapore', 'FORMULA 1 SINGAPORE AIRLINES SINGAPORE GRAND PRIX 2025', 'Marina Bay Street Circuit'),
(19, 'us', 'United States', 'FORMULA 1 MSC CRUISES UNITED STATES GRAND PRIX 2025', 'Circuit of The Americas');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `seasonRaceResult`
--
-- Létrehozva: 2025. Már 23. 18:30
-- Utolsó frissítés: 2025. Már 23. 18:39
--

CREATE TABLE `seasonRaceResult` (
  `id` int(11) NOT NULL,
  `raceId` varchar(5) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `P1` int(11) DEFAULT NULL,
  `P2` int(11) DEFAULT NULL,
  `P3` int(11) DEFAULT NULL,
  `P4` int(11) DEFAULT NULL,
  `P5` int(11) DEFAULT NULL,
  `P6` int(11) DEFAULT NULL,
  `P7` int(11) DEFAULT NULL,
  `P8` int(11) DEFAULT NULL,
  `P9` int(11) DEFAULT NULL,
  `P10` int(11) DEFAULT NULL,
  `P11` int(11) DEFAULT NULL,
  `P12` int(11) DEFAULT NULL,
  `P13` int(11) DEFAULT NULL,
  `P14` int(11) DEFAULT NULL,
  `P15` int(11) DEFAULT NULL,
  `P16` int(11) DEFAULT NULL,
  `P17` int(11) DEFAULT NULL,
  `P18` int(11) DEFAULT NULL,
  `P19` int(11) DEFAULT NULL,
  `P20` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- TÁBLA KAPCSOLATAI `seasonRaceResult`:
--   `raceId`
--       `raceNames` -> `id`
--   `P9`
--       `driverNames` -> `driverId`
--   `P10`
--       `driverNames` -> `driverId`
--   `P11`
--       `driverNames` -> `driverId`
--   `P12`
--       `driverNames` -> `driverId`
--   `P13`
--       `driverNames` -> `driverId`
--   `P14`
--       `driverNames` -> `driverId`
--   `P15`
--       `driverNames` -> `driverId`
--   `P16`
--       `driverNames` -> `driverId`
--   `P17`
--       `driverNames` -> `driverId`
--   `P18`
--       `driverNames` -> `driverId`
--   `P1`
--       `driverNames` -> `driverId`
--   `P19`
--       `driverNames` -> `driverId`
--   `P20`
--       `driverNames` -> `driverId`
--   `P2`
--       `driverNames` -> `driverId`
--   `P3`
--       `driverNames` -> `driverId`
--   `P4`
--       `driverNames` -> `driverId`
--   `P5`
--       `driverNames` -> `driverId`
--   `P6`
--       `driverNames` -> `driverId`
--   `P7`
--       `driverNames` -> `driverId`
--   `P8`
--       `driverNames` -> `driverId`
--

--
-- A tábla adatainak kiíratása `seasonRaceResult`
--

INSERT INTO `seasonRaceResult` (`id`, `raceId`, `type`, `P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `P8`, `P9`, `P10`, `P11`, `P12`, `P13`, `P14`, `P15`, `P16`, `P17`, `P18`, `P19`, `P20`) VALUES
(1, 'au', 1, 2, 5, 7, 8, 17, 9, 19, 3, 1, 4, 11, 14, 15, 16, 6, 20, 10, 18, 12, 13);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `topicComments`
--
-- Létrehozva: 2025. Már 23. 20:23
-- Utolsó frissítés: 2025. Már 23. 20:23
--

CREATE TABLE `topicComments` (
  `topicId` int(11) NOT NULL,
  `commentId` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `commentContent` text DEFAULT NULL,
  `date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- TÁBLA KAPCSOLATAI `topicComments`:
--   `topicId`
--       `forumTopics` -> `topicId`
--   `userId`
--       `user` -> `id`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `topicReports`
--
-- Létrehozva: 2025. Már 23. 20:23
-- Utolsó frissítés: 2025. Már 23. 20:19
--

CREATE TABLE `topicReports` (
  `reportId` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `topicId` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- TÁBLA KAPCSOLATAI `topicReports`:
--   `topicId`
--       `forumTopics` -> `topicId`
--   `userId`
--       `user` -> `id`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `user`
--
-- Létrehozva: 2025. Már 23. 18:36
-- Utolsó frissítés: 2025. Már 23. 20:23
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `permission` int(11) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- TÁBLA KAPCSOLATAI `user`:
--

--
-- A tábla adatainak kiíratása `user`
--

INSERT INTO `user` (`id`, `permission`, `username`, `email`, `password`) VALUES
(0, 1, 'System', '-', '-'),
(1, 1, 'admin', 'admin@gmail.com', '$2b$10$zjkJojt2.zFCZfvjBO3X.u2nFe3ymMEQHVpgGrirmBMi1ThD.nss.'),
(2, 3, 'user', 'user@gmail.com', '$2b$10$38/iOdPkThhnD5nl3SBxBO6HvbhcLEbcTs6QI.lIX8mJqILR605W.'),
(3, 1, 'inancsikrisztian', 'inancsikrisztian@icloud.com', '$2b$10$2T1I1YvAZPy1rPIoPRlEIehmJ3BvBdbpbquqg1edkhqjxAoihYbFO'),
(4, 1, 'fabiant0104', 'fabiantamas@huzsi.hu', '$2b$10$m8dOEaJyjcZ48HuqzPNODOOcn6yQtSvMPFELIiO.1ikFR96Iuctuy'),
(5, 1, 'kisbartok2', 'kisbartok2@gmail.com', '$2b$10$E.PxiVSgsQd7pn7DpAGGweJ0P/s6IOKM2l5HY5bjUayQL4HnmjKVy'),
(6, 2, 'user2', 'user2@gmail.com', '$2b$10$Zp.mdvLQSdZQc9yS38b7kObstJOKa3XXwHgGjJnPkrX.lfYOUU/xi'),
(7, 3, 'user3', 'user3@gmail.com', '$2b$10$tenLbVfOscldLdr90j4hqOp3gQaQIofAb0m1fWX0JuffTFSbmti4y');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `circuitDatas`
--
ALTER TABLE `circuitDatas`
  ADD KEY `id` (`id`);

--
-- A tábla indexei `constructorNames`
--
ALTER TABLE `constructorNames`
  ADD PRIMARY KEY (`constructorId`);

--
-- A tábla indexei `driverNames`
--
ALTER TABLE `driverNames`
  ADD PRIMARY KEY (`driverId`),
  ADD KEY `constructorId` (`constructorId`);

--
-- A tábla indexei `forumTopics`
--
ALTER TABLE `forumTopics`
  ADD PRIMARY KEY (`topicId`),
  ADD KEY `userId` (`userId`);

--
-- A tábla indexei `raceDates`
--
ALTER TABLE `raceDates`
  ADD KEY `id` (`id`);

--
-- A tábla indexei `raceNames`
--
ALTER TABLE `raceNames`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `seasonRaceResult`
--
ALTER TABLE `seasonRaceResult`
  ADD PRIMARY KEY (`id`),
  ADD KEY `raceId` (`raceId`),
  ADD KEY `P1` (`P1`),
  ADD KEY `P2` (`P2`),
  ADD KEY `P3` (`P3`),
  ADD KEY `P4` (`P4`),
  ADD KEY `P5` (`P5`),
  ADD KEY `P6` (`P6`),
  ADD KEY `P7` (`P7`),
  ADD KEY `P8` (`P8`),
  ADD KEY `P9` (`P9`),
  ADD KEY `P10` (`P10`),
  ADD KEY `P11` (`P11`),
  ADD KEY `P12` (`P12`),
  ADD KEY `P13` (`P13`),
  ADD KEY `P14` (`P14`),
  ADD KEY `P15` (`P15`),
  ADD KEY `P16` (`P16`),
  ADD KEY `P17` (`P17`),
  ADD KEY `P18` (`P18`),
  ADD KEY `P19` (`P19`),
  ADD KEY `P20` (`P20`);

--
-- A tábla indexei `topicComments`
--
ALTER TABLE `topicComments`
  ADD PRIMARY KEY (`commentId`),
  ADD KEY `topicId` (`topicId`),
  ADD KEY `userId` (`userId`);

--
-- A tábla indexei `topicReports`
--
ALTER TABLE `topicReports`
  ADD PRIMARY KEY (`reportId`),
  ADD KEY `topicId` (`topicId`),
  ADD KEY `userId` (`userId`);

--
-- A tábla indexei `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `forumTopics`
--
ALTER TABLE `forumTopics`
  MODIFY `topicId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `seasonRaceResult`
--
ALTER TABLE `seasonRaceResult`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `topicComments`
--
ALTER TABLE `topicComments`
  MODIFY `commentId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `topicReports`
--
ALTER TABLE `topicReports`
  MODIFY `reportId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `circuitDatas`
--
ALTER TABLE `circuitDatas`
  ADD CONSTRAINT `circuitdatas_ibfk_1` FOREIGN KEY (`id`) REFERENCES `raceNames` (`id`);

--
-- Megkötések a táblához `driverNames`
--
ALTER TABLE `driverNames`
  ADD CONSTRAINT `drivernames_ibfk_1` FOREIGN KEY (`constructorId`) REFERENCES `constructorNames` (`constructorId`);

--
-- Megkötések a táblához `forumTopics`
--
ALTER TABLE `forumTopics`
  ADD CONSTRAINT `forumtopics_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`);

--
-- Megkötések a táblához `raceDates`
--
ALTER TABLE `raceDates`
  ADD CONSTRAINT `racedates_ibfk_1` FOREIGN KEY (`id`) REFERENCES `raceNames` (`id`);

--
-- Megkötések a táblához `seasonRaceResult`
--
ALTER TABLE `seasonRaceResult`
  ADD CONSTRAINT `seasonraceresult_ibfk_1` FOREIGN KEY (`raceId`) REFERENCES `raceNames` (`id`),
  ADD CONSTRAINT `seasonraceresult_ibfk_10` FOREIGN KEY (`P9`) REFERENCES `driverNames` (`driverId`),
  ADD CONSTRAINT `seasonraceresult_ibfk_11` FOREIGN KEY (`P10`) REFERENCES `driverNames` (`driverId`),
  ADD CONSTRAINT `seasonraceresult_ibfk_12` FOREIGN KEY (`P11`) REFERENCES `driverNames` (`driverId`),
  ADD CONSTRAINT `seasonraceresult_ibfk_13` FOREIGN KEY (`P12`) REFERENCES `driverNames` (`driverId`),
  ADD CONSTRAINT `seasonraceresult_ibfk_14` FOREIGN KEY (`P13`) REFERENCES `driverNames` (`driverId`),
  ADD CONSTRAINT `seasonraceresult_ibfk_15` FOREIGN KEY (`P14`) REFERENCES `driverNames` (`driverId`),
  ADD CONSTRAINT `seasonraceresult_ibfk_16` FOREIGN KEY (`P15`) REFERENCES `driverNames` (`driverId`),
  ADD CONSTRAINT `seasonraceresult_ibfk_17` FOREIGN KEY (`P16`) REFERENCES `driverNames` (`driverId`),
  ADD CONSTRAINT `seasonraceresult_ibfk_18` FOREIGN KEY (`P17`) REFERENCES `driverNames` (`driverId`),
  ADD CONSTRAINT `seasonraceresult_ibfk_19` FOREIGN KEY (`P18`) REFERENCES `driverNames` (`driverId`),
  ADD CONSTRAINT `seasonraceresult_ibfk_2` FOREIGN KEY (`P1`) REFERENCES `driverNames` (`driverId`),
  ADD CONSTRAINT `seasonraceresult_ibfk_20` FOREIGN KEY (`P19`) REFERENCES `driverNames` (`driverId`),
  ADD CONSTRAINT `seasonraceresult_ibfk_21` FOREIGN KEY (`P20`) REFERENCES `driverNames` (`driverId`),
  ADD CONSTRAINT `seasonraceresult_ibfk_3` FOREIGN KEY (`P2`) REFERENCES `driverNames` (`driverId`),
  ADD CONSTRAINT `seasonraceresult_ibfk_4` FOREIGN KEY (`P3`) REFERENCES `driverNames` (`driverId`),
  ADD CONSTRAINT `seasonraceresult_ibfk_5` FOREIGN KEY (`P4`) REFERENCES `driverNames` (`driverId`),
  ADD CONSTRAINT `seasonraceresult_ibfk_6` FOREIGN KEY (`P5`) REFERENCES `driverNames` (`driverId`),
  ADD CONSTRAINT `seasonraceresult_ibfk_7` FOREIGN KEY (`P6`) REFERENCES `driverNames` (`driverId`),
  ADD CONSTRAINT `seasonraceresult_ibfk_8` FOREIGN KEY (`P7`) REFERENCES `driverNames` (`driverId`),
  ADD CONSTRAINT `seasonraceresult_ibfk_9` FOREIGN KEY (`P8`) REFERENCES `driverNames` (`driverId`);

--
-- Megkötések a táblához `topicComments`
--
ALTER TABLE `topicComments`
  ADD CONSTRAINT `topiccomments_ibfk_1` FOREIGN KEY (`topicId`) REFERENCES `forumTopics` (`topicId`),
  ADD CONSTRAINT `topiccomments_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `user` (`id`);

--
-- Megkötések a táblához `topicReports`
--
ALTER TABLE `topicReports`
  ADD CONSTRAINT `topicreports_ibfk_1` FOREIGN KEY (`topicId`) REFERENCES `forumTopics` (`topicId`),
  ADD CONSTRAINT `topicreports_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
