DROP TYPE IF EXISTS categ_parfum;
DROP TYPE IF EXISTS tipuri_produse;

CREATE TYPE categ_parfum AS ENUM( 'nisa', 'designer', 'editie limitata', 'natural', 'artizanal','comuna');
CREATE TYPE tipuri_produse AS ENUM('parfum', 'bodycream', 'candels');


CREATE TABLE IF NOT EXISTS parfumuri (
   id serial PRIMARY KEY,
   nume VARCHAR(50) UNIQUE NOT NULL,
   descriere TEXT,
   pret NUMERIC(8,2) NOT NULL,
   greutate INT NOT NULL CHECK (greutate>=0),   
   tip_produs tipuri_produse DEFAULT 'parfum',
   categorie categ_parfum DEFAULT 'comuna',
   ingrediente VARCHAR [], --pot sa nu fie specificare deci nu punem NOT NULL
   non_alcool BOOLEAN NOT NULL DEFAULT FALSE,
   imagine VARCHAR(300),
   data_adaugare TIMESTAMP DEFAULT current_timestamp
);

INSERT INTO parfumuri (nume, descriere, pret, greutate, tip_produs, categorie, ingrediente, non_alcool, imagine)
VALUES 
('Eternal Blossom', 'Un parfum floral cu note de trandafir și iasomie.', 250.00, 100, 'parfum', 'comuna', ARRAY['trandafir', 'iasomie', 'mosc'], FALSE, 'eternal_blossom.jpg'),
('Noir Mystique', 'Arome lemnoase și condimentate pentru o prezență misterioasă.', 320.50, 90, 'parfum', 'editie limitata', ARRAY['lemn de santal', 'piper negru', 'ambra'], FALSE, 'noir_mystique.jpg'),
('Summer Breeze', 'Parfum fresh cu note de citrice și mentă.', 180.00, 80, 'parfum', 'comuna', ARRAY['lamaie', 'menta', 'bergamota'], FALSE, 'summer_breeze.jpg'),
('Golden Dream', 'Arome dulci de vanilie și caramel.', 210.00, 100, 'parfum', 'designer', ARRAY['vanilie', 'caramel', 'iasomie'], FALSE, 'golden_dream.jpg'),
('Oceanic Spirit', 'Note marine și de alge pentru o senzație răcoritoare.', 195.00, 85, 'parfum', 'nisa', ARRAY['alge', 'sare de mare', 'iasomie'], FALSE, 'oceanic_spirit.jpg'),
('Sweet Childhood', 'Parfum delicat natural, fără alcool.', 120.00, 50, 'parfum', 'natural', ARRAY['capsuni', 'zmeura', 'vanilie'], TRUE, 'sweet_childhood.jpg'),
('Royal Oud', 'Parfum oriental cu note de oud și sofran.', 400.00, 100, 'parfum', 'editie limitata', ARRAY['oud', 'sofran', 'ambra'], FALSE, 'royal_oud.jpg'),
('Candlelight', 'Arome calde de ceară și scorțișoară.', 90.00, 150, 'candels', 'comuna', ARRAY['ceara', 'scortisoara', 'vanilie'], FALSE, 'candlelight.jpg'),
('Velvet Touch', 'Parfum catifelat cu note de piersică și mosc.', 230.00, 100, 'parfum', 'comuna', ARRAY['piersica', 'mosc', 'iasomie'], FALSE, 'velvet_touch.jpg'),
('Body Silk', 'Cremă de corp cu parfum de migdale și cocos.', 75.00, 200, 'bodycream', 'artizanal', ARRAY['migdale', 'cocos', 'unt de shea'], FALSE, 'body_silk.jpg'),
('Forest Whisper', 'Note verzi de pădure și mușchi.', 210.00, 95, 'parfum', 'comuna', ARRAY['muschi', 'pin', 'cedru'], FALSE, 'forest_whisper.jpg'),
('Magic Drops', 'Parfum fructat cu note de mango și papaya.', 160.00, 80, 'parfum', 'comuna', ARRAY['mango', 'papaya', 'iasomie'], FALSE, 'magic_drops.jpg'),
('Anniversary Joy', 'Parfum festiv cu note de șampanie și fructe roșii.', 300.00, 100, 'parfum', 'designer', ARRAY['sampanie', 'fructe rosii', 'vanilie'], FALSE, 'anniversary_joy.jpg'),
('Kids Fun', 'Parfum natural cu aromă de bomboane, fără alcool.', 110.00, 60, 'parfum', 'natural', ARRAY['bomboane', 'zahar', 'vanilie'], TRUE, 'kids_fun.jpg'),
('Special Order', 'Parfum personalizat la comandă.', 500.00, 100, 'parfum', 'nisa', ARRAY['personalizat'], FALSE, 'special_order.jpg');

-- Creare tabele
CREATE TABLE seturi (
    id SERIAL PRIMARY KEY,
    nume_set VARCHAR(100) NOT NULL,
    descriere_set TEXT
);

CREATE TABLE asociere_set (
    id SERIAL PRIMARY KEY,
    id_set INTEGER REFERENCES seturi(id),
    id_produs INTEGER REFERENCES parfumuri(id)
);

-- Populare tabele cu 5 seturi, fiecare cu minim 2 produse (folosind id-uri de la 1 la 15)

INSERT INTO seturi (nume_set, descriere_set) VALUES
('Set Cadou Floral', 'Set cu parfumuri florale pentru orice ocazie.'),
('Set Exotic', 'Set cu parfumuri exotice și fresh.'),
('Set Premium', 'Set cu parfumuri de lux, pentru colecționari.'),
('Set Natural', 'Set cu parfumuri fără alcool, potrivite pentru copii și persoane sensibile.'),
('Set Bestseller', 'Cele mai apreciate parfumuri din colecție.');

-- Set 1: Cadou Floral (id_set = 1)
INSERT INTO asociere_set (id_set, id_produs) VALUES
(1, 1), -- Eternal Blossom
(1, 4), -- Golden Dream
(1, 9); -- Velvet Touch

-- Set 2: Exotic (id_set = 2)
INSERT INTO asociere_set (id_set, id_produs) VALUES
(2, 3), -- Summer Breeze
(2, 5), -- Oceanic Spirit
(2, 12); -- Magic Drops

-- Set 3: Premium (id_set = 3)
INSERT INTO asociere_set (id_set, id_produs) VALUES
(3, 2), -- Noir Mystique
(3, 7), -- Royal Oud
(3, 13); -- Anniversary Joy

-- Set 4: Natural (id_set = 4)
INSERT INTO asociere_set (id_set, id_produs) VALUES
(4, 6), -- Sweet Childhood
(4, 14); -- Kids Fun

-- Set 5: Bestseller (id_set = 5)
INSERT INTO asociere_set (id_set, id_produs) VALUES
(5, 1), -- Eternal Blossom
(5, 2), -- Noir Mystique
(5, 10), -- Body Silk
(5, 11); -- Forest Whisper