-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Jan 28. 13:23
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `racecalendar`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `eventtype`
--

CREATE TABLE `eventtype` (
  `id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `eventtype`
--

INSERT INTO `eventtype` (`id`, `type`) VALUES
(1, 'Regular'),
(2, 'Sprint');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `racedates`
--

CREATE TABLE `racedates` (
  `id` varchar(2) NOT NULL,
  `type` int(1) NOT NULL,
  `event1` datetime NOT NULL,
  `event2` datetime NOT NULL,
  `event3` datetime NOT NULL,
  `event4` datetime NOT NULL,
  `event5` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `racedates`
--

INSERT INTO `racedates` (`id`, `type`, `event1`, `event2`, `event3`, `event4`, `event5`) VALUES
('ae', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
('at', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
('au', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
('az', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
('be', 2, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
('bh', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
('br', 2, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
('ca', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
('cn', 2, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
('er', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
('es', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
('gb', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
('hu', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
('it', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
('jp', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
('lv', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
('mc', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
('mi', 2, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
('mx', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
('nl', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
('qa', 2, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
('sa', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
('sg', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
('us', 2, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `racenames`
--

CREATE TABLE `racenames` (
  `raceNumber` int(11) NOT NULL,
  `id` varchar(2) NOT NULL,
  `name` varchar(50) NOT NULL,
  `fullName` varchar(250) NOT NULL,
  `trackName` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `racenames`
--

INSERT INTO `racenames` (`raceNumber`, `id`, `name`, `fullName`, `trackName`) VALUES
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

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `eventtype`
--
ALTER TABLE `eventtype`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `racedates`
--
ALTER TABLE `racedates`
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `type` (`type`) USING BTREE;

--
-- A tábla indexei `racenames`
--
ALTER TABLE `racenames`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
