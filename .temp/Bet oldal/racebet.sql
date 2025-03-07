-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Feb 04. 09:23
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
-- Adatbázis: `racebet`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `bets`
--

CREATE TABLE `bets` (
  `pilotId` int(11) NOT NULL,
  `bet` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `constructors`
--

CREATE TABLE `constructors` (
  `id` int(11) NOT NULL,
  `name` varchar(250) NOT NULL,
  `pilotId1` int(11) NOT NULL,
  `pilotId2` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `constructors`
--

INSERT INTO `constructors` (`id`, `name`, `pilotId1`, `pilotId2`) VALUES
(1, 'McLaren', 1, 2),
(2, 'Ferrari', 3, 4),
(3, 'Red Bull Racing', 5, 6),
(4, 'Mercedes', 7, 8),
(5, 'Aston Martin', 9, 10),
(6, 'Alpine', 11, 12),
(7, 'Racing Bulls', 13, 14),
(8, 'Haas', 15, 16),
(9, 'Williams', 17, 18),
(10, 'Kick Sauber', 19, 20);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `pilot`
--

CREATE TABLE `pilot` (
  `pilotId` int(11) NOT NULL,
  `fullName` varchar(50) NOT NULL,
  `triCode` varchar(3) NOT NULL,
  `rating` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `pilot`
--

INSERT INTO `pilot` (`pilotId`, `fullName`, `triCode`, `rating`) VALUES
(1, 'Oscar Piastri', 'PIA', 0),
(2, 'Lando Norris', 'NOR', 0),
(3, 'Charles Leclerc', 'LEC', 0),
(4, 'Lewis Hamilton', 'HAM', 0),
(5, 'Max Verstappen', 'VER', 0),
(6, 'Liam Lawson', 'LAW', 0),
(7, 'George Russel', 'RUS', 0),
(8, 'Andrea Kimi  Antonelli', 'ANT', 0),
(9, 'Lance Stroll', 'STR', 0),
(10, 'Fernando Alonso', 'ALO', 0),
(11, 'Pierre Gasly', 'GAS', 0),
(12, 'Jack Doohan', 'DOO', 0),
(13, 'Isack Hadjar', 'HAD', 0),
(14, 'Yuki Tsunoda', 'TSU', 0),
(15, 'Esteban Ocon', 'OCO', 0),
(16, 'Oliver Bearman', 'BEA', 0),
(17, 'Alexander Albon', 'ALB', 0),
(18, 'Carlos Sainz', 'SAI', 0),
(19, 'Nico Hulkenberg', 'HUL', 0),
(20, 'Gabriel Bortoleto', 'BOR', 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `race`
--

CREATE TABLE `race` (
  `raceNumber` int(11) NOT NULL,
  `raceId` varchar(2) NOT NULL,
  `raceName` varchar(200) NOT NULL,
  `country` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `race`
--

INSERT INTO `race` (`raceNumber`, `raceId`, `raceName`, `country`) VALUES
(1, 'au', 'FORMULA 1 AUSTRALIAN GRAND PRIX 2025', 'Australia'),
(2, 'cn', 'FORMULA 1 HEINEKEN CHINESE GRAND PRIX 2025', 'China'),
(3, 'jp', 'FORMULA 1 LENOVO JAPANESE GRAND PRIX 2025', 'Japan'),
(4, 'bh', 'FORMULA 1 BAHRAIN GRAND PRIX 2025', 'Bahrain'),
(5, 'sa', 'FORMULA 1 STC SAUDI ARABIAN GRAND PRIX 2025', 'Saudi Arabia'),
(6, 'mi', 'FORMULA 1 CRYPTO.COM MIAMI GRAND PRIX 2025', 'Miami'),
(2, 'cn', 'FORMULA 1 HEINEKEN CHINESE GRAND PRIX 2025', 'China'),
(3, 'jp', 'FORMULA 1 LENOVO JAPANESE GRAND PRIX 2025', 'Japan'),
(4, 'bh', 'FORMULA 1 BAHRAIN GRAND PRIX 2025', 'Bahrain'),
(5, 'sa', 'FORMULA 1 STC SAUDI ARABIAN GRAND PRIX 2025', 'Saudi Arabia'),
(6, 'mi', 'FORMULA 1 CRYPTO.COM MIAMI GRAND PRIX 2025', 'Miami'),
(7, 'er', 'FORMULA 1 AWS GRAN PREMIO DEL MADE IN ITALY E DELL`EMILIA-ROMAGNA 2025', 'Emilia-Romagna'),
(8, 'mc', 'FORMULA 1 GRAND PRIX DE MONACO 2025', 'Monaco'),
(9, 'es', 'FORMULA 1 ARAMCO GRAN PREMIO DE ESPAÑA 2025', 'Spain'),
(10, 'ca', 'FORMULA 1 PIRELLI GRAND PRIX DU CANADA 2025', 'Canada'),
(11, 'at', 'FORMULA 1 MSC CRUISES AUSTRIAN GRAND PRIX 2025', 'Austria'),
(12, 'gb', 'FORMULA 1 QATAR AIRWAYS BRITISH GRAND PRIX 2025', 'Great Britian'),
(13, 'be', 'FORMULA 1 BELGIAN GRAND PRIX 2025', 'Belgium'),
(14, 'hu', 'FORMULA 1 LENOVO HUNGARIAN GRAND PRIX 2025', 'Hungary'),
(15, 'nl', 'FORMULA 1 HEINEKEN DUTCH GRAND PRIX 2025', 'Netherlands'),
(16, 'it', 'FORMULA 1 PIRELLI GRAN PREMIO D’ITALIA 2025', 'Italy'),
(17, 'az', 'FORMULA 1 QATAR AIRWAYS AZERBAIJAN GRAND PRIX 2025', 'Azerbaijan'),
(18, 'sg', 'FORMULA 1 SINGAPORE AIRLINES SINGAPORE GRAND PRIX 2025', 'Singapore'),
(19, 'us', 'FORMULA 1 MSC CRUISES UNITED STATES GRAND PRIX 2025', 'United States'),
(20, 'mx', 'FORMULA 1 GRAN PREMIO DE LA CIUDAD DE MÉXICO 2025', 'Mexico'),
(21, 'br', 'FORMULA 1 MSC CRUISES GRANDE PRÊMIO DE SÃO PAULO 2025', 'Brazil'),
(22, 'lv', 'FORMULA 1 HEINEKEN LAS VEGAS GRAND PRIX 2025', 'Las Vegas'),
(23, 'qa', 'FORMULA 1 QATAR AIRWAYS QATAR GRAND PRIX 2025', 'Qatar'),
(24, 'ae', 'FORMULA 1 ETIHAD AIRWAYS ABU DHABI GRAND PRIX 2025', 'Abu Dhabi');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
