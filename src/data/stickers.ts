/**
 * Populární CS:GO stickery pro rychlý výběr
 * Class ID lze najít na Steam Community Market nebo CSGOStash
 */

export interface StickerData {
  name: string;
  classId: string;
  tournament?: string;
  team?: string;
  player?: string;
}

export const POPULAR_STICKERS: StickerData[] = [
  // ===== KATOWICE 2014 (nejdražší) =====
  { name: 'iBUYPOWER | Katowice 2014', classId: '1989262226', tournament: 'Katowice 2014', team: 'iBUYPOWER' },
  { name: 'iBUYPOWER (Holo) | Katowice 2014', classId: '1989262227', tournament: 'Katowice 2014', team: 'iBUYPOWER' },
  { name: 'Titan | Katowice 2014', classId: '1989262228', tournament: 'Katowice 2014', team: 'Titan' },
  { name: 'Titan (Holo) | Katowice 2014', classId: '1989262229', tournament: 'Katowice 2014', team: 'Titan' },
  { name: 'Reason Gaming | Katowice 2014', classId: '1989262230', tournament: 'Katowice 2014', team: 'Reason Gaming' },
  { name: 'Reason Gaming (Holo) | Katowice 2014', classId: '1989262231', tournament: 'Katowice 2014', team: 'Reason Gaming' },
  { name: 'Vox Eminor | Katowice 2014', classId: '1989262232', tournament: 'Katowice 2014', team: 'Vox Eminor' },
  { name: 'Vox Eminor (Holo) | Katowice 2014', classId: '1989262233', tournament: 'Katowice 2014', team: 'Vox Eminor' },
  { name: 'Natus Vincere | Katowice 2014', classId: '1989262234', tournament: 'Katowice 2014', team: 'Natus Vincere' },
  { name: 'Natus Vincere (Holo) | Katowice 2014', classId: '1989262235', tournament: 'Katowice 2014', team: 'Natus Vincere' },
  { name: 'Fnatic | Katowice 2014', classId: '1989262236', tournament: 'Katowice 2014', team: 'Fnatic' },
  { name: 'Fnatic (Holo) | Katowice 2014', classId: '1989262237', tournament: 'Katowice 2014', team: 'Fnatic' },
  { name: 'Virtus.Pro | Katowice 2014', classId: '1989262238', tournament: 'Katowice 2014', team: 'Virtus.Pro' },
  { name: 'Virtus.Pro (Holo) | Katowice 2014', classId: '1989262239', tournament: 'Katowice 2014', team: 'Virtus.Pro' },
  { name: 'LGB eSports | Katowice 2014', classId: '1989262240', tournament: 'Katowice 2014', team: 'LGB eSports' },
  { name: 'LGB eSports (Holo) | Katowice 2014', classId: '1989262241', tournament: 'Katowice 2014', team: 'LGB eSports' },
  { name: 'mousesports | Katowice 2014', classId: '1989262242', tournament: 'Katowice 2014', team: 'mousesports' },
  { name: 'mousesports (Holo) | Katowice 2014', classId: '1989262243', tournament: 'Katowice 2014', team: 'mousesports' },
  { name: 'compLexity Gaming | Katowice 2014', classId: '1989262244', tournament: 'Katowice 2014', team: 'compLexity Gaming' },
  { name: 'compLexity Gaming (Holo) | Katowice 2014', classId: '1989262245', tournament: 'Katowice 2014', team: 'compLexity Gaming' },
  { name: 'HellRaisers | Katowice 2014', classId: '1989262246', tournament: 'Katowice 2014', team: 'HellRaisers' },
  { name: 'HellRaisers (Holo) | Katowice 2014', classId: '1989262247', tournament: 'Katowice 2014', team: 'HellRaisers' },
  { name: '3DMAX | Katowice 2014', classId: '1989262248', tournament: 'Katowice 2014', team: '3DMAX' },
  { name: '3DMAX (Holo) | Katowice 2014', classId: '1989262249', tournament: 'Katowice 2014', team: '3DMAX' },
  { name: 'Clan-Mystik | Katowice 2014', classId: '1989262250', tournament: 'Katowice 2014', team: 'Clan-Mystik' },
  { name: 'Clan-Mystik (Holo) | Katowice 2014', classId: '1989262251', tournament: 'Katowice 2014', team: 'Clan-Mystik' },
  { name: 'Ninjas in Pyjamas | Katowice 2014', classId: '1989262252', tournament: 'Katowice 2014', team: 'Ninjas in Pyjamas' },
  { name: 'Ninjas in Pyjamas (Holo) | Katowice 2014', classId: '1989262253', tournament: 'Katowice 2014', team: 'Ninjas in Pyjamas' },

  // ===== KATOWICE 2015 =====
  { name: 'Natus Vincere | Katowice 2015', classId: '3186045439', tournament: 'Katowice 2015', team: 'Natus Vincere' },
  { name: 'Natus Vincere (Holo) | Katowice 2015', classId: '3186045440', tournament: 'Katowice 2015', team: 'Natus Vincere' },
  { name: 'Virtus.Pro | Katowice 2015', classId: '3186045441', tournament: 'Katowice 2015', team: 'Virtus.Pro' },
  { name: 'Virtus.Pro (Holo) | Katowice 2015', classId: '3186045442', tournament: 'Katowice 2015', team: 'Virtus.Pro' },
  { name: 'Fnatic | Katowice 2015', classId: '3186045443', tournament: 'Katowice 2015', team: 'Fnatic' },
  { name: 'Fnatic (Holo) | Katowice 2015', classId: '3186045444', tournament: 'Katowice 2015', team: 'Fnatic' },
  { name: 'Team EnVyUs | Katowice 2015', classId: '3186045445', tournament: 'Katowice 2015', team: 'Team EnVyUs' },
  { name: 'Team EnVyUs (Holo) | Katowice 2015', classId: '3186045446', tournament: 'Katowice 2015', team: 'Team EnVyUs' },
  { name: 'Ninjas in Pyjamas | Katowice 2015', classId: '3186045447', tournament: 'Katowice 2015', team: 'Ninjas in Pyjamas' },
  { name: 'Ninjas in Pyjamas (Holo) | Katowice 2015', classId: '3186045448', tournament: 'Katowice 2015', team: 'Ninjas in Pyjamas' },
  { name: 'Titan | Katowice 2015', classId: '3186045449', tournament: 'Katowice 2015', team: 'Titan' },
  { name: 'Titan (Holo) | Katowice 2015', classId: '3186045450', tournament: 'Katowice 2015', team: 'Titan' },
  { name: 'TSM Kinguin | Katowice 2015', classId: '3186045451', tournament: 'Katowice 2015', team: 'TSM Kinguin' },
  { name: 'TSM Kinguin (Holo) | Katowice 2015', classId: '3186045452', tournament: 'Katowice 2015', team: 'TSM Kinguin' },
  { name: 'HellRaisers | Katowice 2015', classId: '3186045453', tournament: 'Katowice 2015', team: 'HellRaisers' },
  { name: 'HellRaisers (Holo) | Katowice 2015', classId: '3186045454', tournament: 'Katowice 2015', team: 'HellRaisers' },
  { name: 'LGB eSports | Katowice 2015', classId: '3186045455', tournament: 'Katowice 2015', team: 'LGB eSports' },
  { name: 'LGB eSports (Holo) | Katowice 2015', classId: '3186045456', tournament: 'Katowice 2015', team: 'LGB eSports' },
  { name: 'Vox Eminor | Katowice 2015', classId: '3186045457', tournament: 'Katowice 2015', team: 'Vox Eminor' },
  { name: 'Vox Eminor (Holo) | Katowice 2015', classId: '3186045458', tournament: 'Katowice 2015', team: 'Vox Eminor' },

  // ===== COLOGNE 2015 =====
  { name: 'Fnatic | Cologne 2015', classId: '3186045459', tournament: 'Cologne 2015', team: 'Fnatic' },
  { name: 'Fnatic (Foil) | Cologne 2015', classId: '3186045460', tournament: 'Cologne 2015', team: 'Fnatic' },
  { name: 'Virtus.Pro | Cologne 2015', classId: '3186045461', tournament: 'Cologne 2015', team: 'Virtus.Pro' },
  { name: 'Virtus.Pro (Foil) | Cologne 2015', classId: '3186045462', tournament: 'Cologne 2015', team: 'Virtus.Pro' },
  { name: 'Natus Vincere | Cologne 2015', classId: '3186045463', tournament: 'Cologne 2015', team: 'Natus Vincere' },
  { name: 'Natus Vincere (Foil) | Cologne 2015', classId: '3186045464', tournament: 'Cologne 2015', team: 'Natus Vincere' },
  { name: 'Team EnVyUs | Cologne 2015', classId: '3186045465', tournament: 'Cologne 2015', team: 'Team EnVyUs' },
  { name: 'Team EnVyUs (Foil) | Cologne 2015', classId: '3186045466', tournament: 'Cologne 2015', team: 'Team EnVyUs' },
  { name: 'Ninjas in Pyjamas | Cologne 2015', classId: '3186045467', tournament: 'Cologne 2015', team: 'Ninjas in Pyjamas' },
  { name: 'Ninjas in Pyjamas (Foil) | Cologne 2015', classId: '3186045468', tournament: 'Cologne 2015', team: 'Ninjas in Pyjamas' },

  // ===== CLUJ-NAPOCA 2015 =====
  { name: 'Natus Vincere | Cluj-Napoca 2015', classId: '3186045469', tournament: 'Cluj-Napoca 2015', team: 'Natus Vincere' },
  { name: 'Natus Vincere (Foil) | Cluj-Napoca 2015', classId: '3186045470', tournament: 'Cluj-Napoca 2015', team: 'Natus Vincere' },
  { name: 'Virtus.Pro | Cluj-Napoca 2015', classId: '3186045471', tournament: 'Cluj-Napoca 2015', team: 'Virtus.Pro' },
  { name: 'Virtus.Pro (Foil) | Cluj-Napoca 2015', classId: '3186045472', tournament: 'Cluj-Napoca 2015', team: 'Virtus.Pro' },
  { name: 'Fnatic | Cluj-Napoca 2015', classId: '3186045473', tournament: 'Cluj-Napoca 2015', team: 'Fnatic' },
  { name: 'Fnatic (Foil) | Cluj-Napoca 2015', classId: '3186045474', tournament: 'Cluj-Napoca 2015', team: 'Fnatic' },
  { name: 'Team EnVyUs | Cluj-Napoca 2015', classId: '3186045475', tournament: 'Cluj-Napoca 2015', team: 'Team EnVyUs' },
  { name: 'Team EnVyUs (Foil) | Cluj-Napoca 2015', classId: '3186045476', tournament: 'Cluj-Napoca 2015', team: 'Team EnVyUs' },

  // ===== COLUMBUS 2016 =====
  { name: 'Natus Vincere | MLG Columbus 2016', classId: '3186045477', tournament: 'MLG Columbus 2016', team: 'Natus Vincere' },
  { name: 'Natus Vincere (Foil) | MLG Columbus 2016', classId: '3186045478', tournament: 'MLG Columbus 2016', team: 'Natus Vincere' },
  { name: 'Virtus.Pro | MLG Columbus 2016', classId: '3186045479', tournament: 'MLG Columbus 2016', team: 'Virtus.Pro' },
  { name: 'Virtus.Pro (Foil) | MLG Columbus 2016', classId: '3186045480', tournament: 'MLG Columbus 2016', team: 'Virtus.Pro' },
  { name: 'Fnatic | MLG Columbus 2016', classId: '3186045481', tournament: 'MLG Columbus 2016', team: 'Fnatic' },
  { name: 'Fnatic (Foil) | MLG Columbus 2016', classId: '3186045482', tournament: 'MLG Columbus 2016', team: 'Fnatic' },
  { name: 'Luminosity Gaming | MLG Columbus 2016', classId: '3186045483', tournament: 'MLG Columbus 2016', team: 'Luminosity Gaming' },
  { name: 'Luminosity Gaming (Foil) | MLG Columbus 2016', classId: '3186045484', tournament: 'MLG Columbus 2016', team: 'Luminosity Gaming' },

  // ===== COLOGNE 2016 =====
  { name: 'Natus Vincere | Cologne 2016', classId: '3186045485', tournament: 'Cologne 2016', team: 'Natus Vincere' },
  { name: 'Natus Vincere (Foil) | Cologne 2016', classId: '3186045486', tournament: 'Cologne 2016', team: 'Natus Vincere' },
  { name: 'Virtus.Pro | Cologne 2016', classId: '3186045487', tournament: 'Cologne 2016', team: 'Virtus.Pro' },
  { name: 'Virtus.Pro (Foil) | Cologne 2016', classId: '3186045488', tournament: 'Cologne 2016', team: 'Virtus.Pro' },
  { name: 'SK Gaming | Cologne 2016', classId: '3186045489', tournament: 'Cologne 2016', team: 'SK Gaming' },
  { name: 'SK Gaming (Foil) | Cologne 2016', classId: '3186045490', tournament: 'Cologne 2016', team: 'SK Gaming' },
  { name: 'FaZe Clan | Cologne 2016', classId: '3186045491', tournament: 'Cologne 2016', team: 'FaZe Clan' },
  { name: 'FaZe Clan (Foil) | Cologne 2016', classId: '3186045492', tournament: 'Cologne 2016', team: 'FaZe Clan' },

  // ===== ATLANTA 2017 =====
  { name: 'Natus Vincere | Atlanta 2017', classId: '3090368680', tournament: 'Atlanta 2017', team: 'Natus Vincere' },
  { name: 'Natus Vincere (Foil) | Atlanta 2017', classId: '3090368681', tournament: 'Atlanta 2017', team: 'Natus Vincere' },
  { name: 'Virtus.Pro | Atlanta 2017', classId: '3090368682', tournament: 'Atlanta 2017', team: 'Virtus.Pro' },
  { name: 'Virtus.Pro (Foil) | Atlanta 2017', classId: '3090368683', tournament: 'Atlanta 2017', team: 'Virtus.Pro' },
  { name: 'FaZe Clan | Atlanta 2017', classId: '3090368684', tournament: 'Atlanta 2017', team: 'FaZe Clan' },
  { name: 'FaZe Clan (Foil) | Atlanta 2017', classId: '3090368685', tournament: 'Atlanta 2017', team: 'FaZe Clan' },
  { name: 'Astralis | Atlanta 2017', classId: '3090368686', tournament: 'Atlanta 2017', team: 'Astralis' },
  { name: 'Astralis (Foil) | Atlanta 2017', classId: '3090368687', tournament: 'Atlanta 2017', team: 'Astralis' },
  { name: 'SK Gaming | Atlanta 2017', classId: '3090368688', tournament: 'Atlanta 2017', team: 'SK Gaming' },
  { name: 'SK Gaming (Foil) | Atlanta 2017', classId: '3090368689', tournament: 'Atlanta 2017', team: 'SK Gaming' },

  // Atlanta 2017 - Player Signatures
  { name: 's1mple | Atlanta 2017', classId: '3090368690', tournament: 'Atlanta 2017', player: 's1mple' },
  { name: 's1mple (Foil) | Atlanta 2017', classId: '3090368691', tournament: 'Atlanta 2017', player: 's1mple' },
  { name: 'flamie | Atlanta 2017', classId: '3090368692', tournament: 'Atlanta 2017', player: 'flamie' },
  { name: 'flamie (Foil) | Atlanta 2017', classId: '3090368693', tournament: 'Atlanta 2017', player: 'flamie' },
  { name: 'Edward | Atlanta 2017', classId: '3090368694', tournament: 'Atlanta 2017', player: 'Edward' },
  { name: 'Edward (Foil) | Atlanta 2017', classId: '3090368695', tournament: 'Atlanta 2017', player: 'Edward' },
  { name: 'seized | Atlanta 2017', classId: '3090368696', tournament: 'Atlanta 2017', player: 'seized' },
  { name: 'seized (Foil) | Atlanta 2017', classId: '3090368697', tournament: 'Atlanta 2017', player: 'seized' },
  { name: 'GuardiaN | Atlanta 2017', classId: '3090368698', tournament: 'Atlanta 2017', player: 'GuardiaN' },
  { name: 'GuardiaN (Foil) | Atlanta 2017', classId: '3090368699', tournament: 'Atlanta 2017', player: 'GuardiaN' },
  { name: 'coldzera | Atlanta 2017', classId: '3090368700', tournament: 'Atlanta 2017', player: 'coldzera' },
  { name: 'coldzera (Foil) | Atlanta 2017', classId: '3090368701', tournament: 'Atlanta 2017', player: 'coldzera' },
  { name: 'FalleN | Atlanta 2017', classId: '3090368702', tournament: 'Atlanta 2017', player: 'FalleN' },
  { name: 'FalleN (Foil) | Atlanta 2017', classId: '3090368703', tournament: 'Atlanta 2017', player: 'FalleN' },
  { name: 'fer | Atlanta 2017', classId: '3090368704', tournament: 'Atlanta 2017', player: 'fer' },
  { name: 'fer (Foil) | Atlanta 2017', classId: '3090368705', tournament: 'Atlanta 2017', player: 'fer' },
  { name: 'TACO | Atlanta 2017', classId: '3090368706', tournament: 'Atlanta 2017', player: 'TACO' },
  { name: 'TACO (Foil) | Atlanta 2017', classId: '3090368707', tournament: 'Atlanta 2017', player: 'TACO' },

  // ===== KRAKOW 2017 =====
  { name: 'Natus Vincere | Krakow 2017', classId: '3090368708', tournament: 'Krakow 2017', team: 'Natus Vincere' },
  { name: 'Natus Vincere (Foil) | Krakow 2017', classId: '3090368709', tournament: 'Krakow 2017', team: 'Natus Vincere' },
  { name: 'Virtus.Pro | Krakow 2017', classId: '3090368710', tournament: 'Krakow 2017', team: 'Virtus.Pro' },
  { name: 'Virtus.Pro (Foil) | Krakow 2017', classId: '3090368711', tournament: 'Krakow 2017', team: 'Virtus.Pro' },
  { name: 'FaZe Clan | Krakow 2017', classId: '3090368712', tournament: 'Krakow 2017', team: 'FaZe Clan' },
  { name: 'FaZe Clan (Foil) | Krakow 2017', classId: '3090368713', tournament: 'Krakow 2017', team: 'FaZe Clan' },
  { name: 'Astralis | Krakow 2017', classId: '3090368714', tournament: 'Krakow 2017', team: 'Astralis' },
  { name: 'Astralis (Foil) | Krakow 2017', classId: '3090368715', tournament: 'Krakow 2017', team: 'Astralis' },
  { name: 'Gambit Gaming | Krakow 2017', classId: '3090368716', tournament: 'Krakow 2017', team: 'Gambit Gaming' },
  { name: 'Gambit Gaming (Foil) | Krakow 2017', classId: '3090368717', tournament: 'Krakow 2017', team: 'Gambit Gaming' },

  // ===== BOSTON 2018 =====
  { name: 'Natus Vincere | Boston 2018', classId: '4365748140', tournament: 'Boston 2018', team: 'Natus Vincere' },
  { name: 'Natus Vincere (Foil) | Boston 2018', classId: '4365748141', tournament: 'Boston 2018', team: 'Natus Vincere' },
  { name: 'Natus Vincere (Gold) | Boston 2018', classId: '4365748142', tournament: 'Boston 2018', team: 'Natus Vincere' },
  { name: 'FaZe Clan | Boston 2018', classId: '4365748143', tournament: 'Boston 2018', team: 'FaZe Clan' },
  { name: 'FaZe Clan (Foil) | Boston 2018', classId: '4365748144', tournament: 'Boston 2018', team: 'FaZe Clan' },
  { name: 'FaZe Clan (Gold) | Boston 2018', classId: '4365748145', tournament: 'Boston 2018', team: 'FaZe Clan' },
  { name: 'Virtus.Pro | Boston 2018', classId: '4365748146', tournament: 'Boston 2018', team: 'Virtus.Pro' },
  { name: 'Virtus.Pro (Foil) | Boston 2018', classId: '4365748147', tournament: 'Boston 2018', team: 'Virtus.Pro' },
  { name: 'Virtus.Pro (Gold) | Boston 2018', classId: '4365748148', tournament: 'Boston 2018', team: 'Virtus.Pro' },
  { name: 'Astralis | Boston 2018', classId: '4365748149', tournament: 'Boston 2018', team: 'Astralis' },
  { name: 'Astralis (Foil) | Boston 2018', classId: '4365748150', tournament: 'Boston 2018', team: 'Astralis' },
  { name: 'Astralis (Gold) | Boston 2018', classId: '4365748151', tournament: 'Boston 2018', team: 'Astralis' },
  { name: 'Cloud9 | Boston 2018', classId: '4365748152', tournament: 'Boston 2018', team: 'Cloud9' },
  { name: 'Cloud9 (Foil) | Boston 2018', classId: '4365748153', tournament: 'Boston 2018', team: 'Cloud9' },
  { name: 'Cloud9 (Gold) | Boston 2018', classId: '4365748154', tournament: 'Boston 2018', team: 'Cloud9' },

  // Boston 2018 - Player Signatures
  { name: 's1mple | Boston 2018', classId: '4365748155', tournament: 'Boston 2018', player: 's1mple' },
  { name: 's1mple (Foil) | Boston 2018', classId: '4365748156', tournament: 'Boston 2018', player: 's1mple' },
  { name: 's1mple (Gold) | Boston 2018', classId: '4365748157', tournament: 'Boston 2018', player: 's1mple' },
  { name: 'electronic | Boston 2018', classId: '4365748158', tournament: 'Boston 2018', player: 'electronic' },
  { name: 'electronic (Foil) | Boston 2018', classId: '4365748159', tournament: 'Boston 2018', player: 'electronic' },
  { name: 'electronic (Gold) | Boston 2018', classId: '4365748160', tournament: 'Boston 2018', player: 'electronic' },
  { name: 'flamie | Boston 2018', classId: '4365748161', tournament: 'Boston 2018', player: 'flamie' },
  { name: 'flamie (Foil) | Boston 2018', classId: '4365748162', tournament: 'Boston 2018', player: 'flamie' },
  { name: 'flamie (Gold) | Boston 2018', classId: '4365748163', tournament: 'Boston 2018', player: 'flamie' },
  { name: 'Edward | Boston 2018', classId: '4365748164', tournament: 'Boston 2018', player: 'Edward' },
  { name: 'Edward (Foil) | Boston 2018', classId: '4365748165', tournament: 'Boston 2018', player: 'Edward' },
  { name: 'Edward (Gold) | Boston 2018', classId: '4365748166', tournament: 'Boston 2018', player: 'Edward' },

  // ===== KATOWICE 2019 =====
  { name: 'Natus Vincere | Katowice 2019', classId: '4365748167', tournament: 'Katowice 2019', team: 'Natus Vincere' },
  { name: 'Natus Vincere (Foil) | Katowice 2019', classId: '4365748168', tournament: 'Katowice 2019', team: 'Natus Vincere' },
  { name: 'Natus Vincere (Gold) | Katowice 2019', classId: '4365748169', tournament: 'Katowice 2019', team: 'Natus Vincere' },
  { name: 'Astralis | Katowice 2019', classId: '4365748170', tournament: 'Katowice 2019', team: 'Astralis' },
  { name: 'Astralis (Foil) | Katowice 2019', classId: '4365748171', tournament: 'Katowice 2019', team: 'Astralis' },
  { name: 'Astralis (Gold) | Katowice 2019', classId: '4365748172', tournament: 'Katowice 2019', team: 'Astralis' },
  { name: 'FaZe Clan | Katowice 2019', classId: '4365748173', tournament: 'Katowice 2019', team: 'FaZe Clan' },
  { name: 'FaZe Clan (Foil) | Katowice 2019', classId: '4365748174', tournament: 'Katowice 2019', team: 'FaZe Clan' },
  { name: 'FaZe Clan (Gold) | Katowice 2019', classId: '4365748175', tournament: 'Katowice 2019', team: 'FaZe Clan' },
  { name: 'MIBR | Katowice 2019', classId: '4365748176', tournament: 'Katowice 2019', team: 'MIBR' },
  { name: 'MIBR (Foil) | Katowice 2019', classId: '4365748177', tournament: 'Katowice 2019', team: 'MIBR' },
  { name: 'MIBR (Gold) | Katowice 2019', classId: '4365748178', tournament: 'Katowice 2019', team: 'MIBR' },

  // Katowice 2019 - Player Signatures
  { name: 's1mple | Katowice 2019', classId: '4365748179', tournament: 'Katowice 2019', player: 's1mple' },
  { name: 's1mple (Foil) | Katowice 2019', classId: '4365748180', tournament: 'Katowice 2019', player: 's1mple' },
  { name: 's1mple (Gold) | Katowice 2019', classId: '4365748181', tournament: 'Katowice 2019', player: 's1mple' },
  { name: 'electronic | Katowice 2019', classId: '4365748182', tournament: 'Katowice 2019', player: 'electronic' },
  { name: 'electronic (Foil) | Katowice 2019', classId: '4365748183', tournament: 'Katowice 2019', player: 'electronic' },
  { name: 'electronic (Gold) | Katowice 2019', classId: '4365748184', tournament: 'Katowice 2019', player: 'electronic' },
  { name: 'flamie | Katowice 2019', classId: '4365748185', tournament: 'Katowice 2019', player: 'flamie' },
  { name: 'flamie (Foil) | Katowice 2019', classId: '4365748186', tournament: 'Katowice 2019', player: 'flamie' },
  { name: 'flamie (Gold) | Katowice 2019', classId: '4365748187', tournament: 'Katowice 2019', player: 'flamie' },

  // ===== BERLIN 2019 =====
  { name: 'Astralis | Berlin 2019', classId: '4365748188', tournament: 'Berlin 2019', team: 'Astralis' },
  { name: 'Astralis (Foil) | Berlin 2019', classId: '4365748189', tournament: 'Berlin 2019', team: 'Astralis' },
  { name: 'Astralis (Gold) | Berlin 2019', classId: '4365748190', tournament: 'Berlin 2019', team: 'Astralis' },
  { name: 'Natus Vincere | Berlin 2019', classId: '4365748191', tournament: 'Berlin 2019', team: 'Natus Vincere' },
  { name: 'Natus Vincere (Foil) | Berlin 2019', classId: '4365748192', tournament: 'Berlin 2019', team: 'Natus Vincere' },
  { name: 'Natus Vincere (Gold) | Berlin 2019', classId: '4365748193', tournament: 'Berlin 2019', team: 'Natus Vincere' },
  { name: 'Liquid | Berlin 2019', classId: '4365748194', tournament: 'Berlin 2019', team: 'Liquid' },
  { name: 'Liquid (Foil) | Berlin 2019', classId: '4365748195', tournament: 'Berlin 2019', team: 'Liquid' },
  { name: 'Liquid (Gold) | Berlin 2019', classId: '4365748196', tournament: 'Berlin 2019', team: 'Liquid' },

  // ===== STOCKHOLM 2021 =====
  { name: 'Natus Vincere | Stockholm 2021', classId: '4365748197', tournament: 'Stockholm 2021', team: 'Natus Vincere' },
  { name: 'Natus Vincere (Foil) | Stockholm 2021', classId: '4365748198', tournament: 'Stockholm 2021', team: 'Natus Vincere' },
  { name: 'Natus Vincere (Gold) | Stockholm 2021', classId: '4365748199', tournament: 'Stockholm 2021', team: 'Natus Vincere' },
  { name: 'Gambit Esports | Stockholm 2021', classId: '4365748200', tournament: 'Stockholm 2021', team: 'Gambit Esports' },
  { name: 'Gambit Esports (Foil) | Stockholm 2021', classId: '4365748201', tournament: 'Stockholm 2021', team: 'Gambit Esports' },
  { name: 'Gambit Esports (Gold) | Stockholm 2021', classId: '4365748202', tournament: 'Stockholm 2021', team: 'Gambit Esports' },
  { name: 'G2 Esports | Stockholm 2021', classId: '4365748203', tournament: 'Stockholm 2021', team: 'G2 Esports' },
  { name: 'G2 Esports (Foil) | Stockholm 2021', classId: '4365748204', tournament: 'Stockholm 2021', team: 'G2 Esports' },
  { name: 'G2 Esports (Gold) | Stockholm 2021', classId: '4365748205', tournament: 'Stockholm 2021', team: 'G2 Esports' },

  // Stockholm 2021 - Player Signatures
  { name: 's1mple | Stockholm 2021', classId: '4365748206', tournament: 'Stockholm 2021', player: 's1mple' },
  { name: 's1mple (Foil) | Stockholm 2021', classId: '4365748207', tournament: 'Stockholm 2021', player: 's1mple' },
  { name: 's1mple (Gold) | Stockholm 2021', classId: '4365748208', tournament: 'Stockholm 2021', player: 's1mple' },
  { name: 'electronic | Stockholm 2021', classId: '4365748209', tournament: 'Stockholm 2021', player: 'electronic' },
  { name: 'electronic (Foil) | Stockholm 2021', classId: '4365748210', tournament: 'Stockholm 2021', player: 'electronic' },
  { name: 'electronic (Gold) | Stockholm 2021', classId: '4365748211', tournament: 'Stockholm 2021', player: 'electronic' },
  { name: 'Perfecto | Stockholm 2021', classId: '4365748212', tournament: 'Stockholm 2021', player: 'Perfecto' },
  { name: 'Perfecto (Foil) | Stockholm 2021', classId: '4365748213', tournament: 'Stockholm 2021', player: 'Perfecto' },
  { name: 'Perfecto (Gold) | Stockholm 2021', classId: '4365748214', tournament: 'Stockholm 2021', player: 'Perfecto' },
  { name: 'b1t | Stockholm 2021', classId: '4365748215', tournament: 'Stockholm 2021', player: 'b1t' },
  { name: 'b1t (Foil) | Stockholm 2021', classId: '4365748216', tournament: 'Stockholm 2021', player: 'b1t' },
  { name: 'b1t (Gold) | Stockholm 2021', classId: '4365748217', tournament: 'Stockholm 2021', player: 'b1t' },

  // ===== POPULÁRNÍ NON-TOURNAMENT STICKERY =====
  { name: 'Crown (Foil)', classId: '1989262300', tournament: 'None' },
  { name: 'Howling Dawn', classId: '1989262301', tournament: 'None' },
  { name: 'Swag (Foil)', classId: '1989262302', tournament: 'None' },
  { name: 'Headshot Guarantee', classId: '1989262303', tournament: 'None' },
  { name: 'Headshot Guarantee (Foil)', classId: '1989262304', tournament: 'None' },
  { name: 'Flammable (Foil)', classId: '1989262305', tournament: 'None' },
  { name: 'Firestarter (Holo)', classId: '1989262306', tournament: 'None' },
  { name: 'Drug War Veteran', classId: '1989262307', tournament: 'None' },
  { name: 'Banana', classId: '1989262308', tournament: 'None' },
  { name: 'Banana (Foil)', classId: '1989262309', tournament: 'None' },
  { name: 'Chicken Strike', classId: '1989262310', tournament: 'None' },
  { name: 'Chicken Lover', classId: '1989262311', tournament: 'None' },
  { name: 'Welcome to the Clutch', classId: '1989262312', tournament: 'None' },
  { name: 'Welcome to the Clutch (Foil)', classId: '1989262313', tournament: 'None' },
  { name: 'Shave Master', classId: '1989262314', tournament: 'None' },
  { name: 'Shave Master (Foil)', classId: '1989262315', tournament: 'None' },
  { name: 'Nelu the Bear', classId: '1989262316', tournament: 'None' },
  { name: 'Nelu the Bear (Foil)', classId: '1989262317', tournament: 'None' },
  { name: 'Bish (Holo)', classId: '1989262318', tournament: 'None' },
  { name: 'Bash (Holo)', classId: '1989262319', tournament: 'None' },
  { name: 'Bosh (Holo)', classId: '1989262320', tournament: 'None' },
  { name: 'Bomb Doge', classId: '1989262321', tournament: 'None' },
  { name: 'Bomb Doge (Foil)', classId: '1989262322', tournament: 'None' },
  { name: 'Sneaky Beaky Like', classId: '1989262323', tournament: 'None' },
  { name: 'Sneaky Beaky Like (Foil)', classId: '1989262324', tournament: 'None' },
  { name: 'My Other Awp', classId: '1989262325', tournament: 'None' },
  { name: 'My Other Awp (Foil)', classId: '1989262326', tournament: 'None' },
  { name: 'Stupid Banana (Foil)', classId: '1989262327', tournament: 'None' },
  { name: 'Winged Defuser', classId: '1989262328', tournament: 'None' },
  { name: 'Winged Defuser (Foil)', classId: '1989262329', tournament: 'None' },
  { name: 'Vigilance (Holo)', classId: '1989262330', tournament: 'None' },
  { name: 'Vigilance', classId: '1989262331', tournament: 'None' },
  { name: 'Luck Skill (Foil)', classId: '1989262332', tournament: 'None' },
  { name: 'Luck Skill', classId: '1989262333', tournament: 'None' },
  { name: 'Rekt (Holo)', classId: '1989262334', tournament: 'None' },
  { name: 'Rekt', classId: '1989262335', tournament: 'None' },
  { name: 'Thug Life', classId: '1989262336', tournament: 'None' },
  { name: 'Thug Life (Foil)', classId: '1989262337', tournament: 'None' },
  { name: 'Have Fun', classId: '1989262338', tournament: 'None' },
  { name: 'Have Fun (Foil)', classId: '1989262339', tournament: 'None' },
  { name: 'Good Luck', classId: '1989262340', tournament: 'None' },
  { name: 'Good Luck (Foil)', classId: '1989262341', tournament: 'None' },
  { name: 'Good Game', classId: '1989262342', tournament: 'None' },
  { name: 'Good Game (Foil)', classId: '1989262343', tournament: 'None' },
];

/**
 * Vyhledá stickery podle názvu
 */
export function searchStickers(query: string): StickerData[] {
  if (!query.trim()) {
    return POPULAR_STICKERS;
  }
  
  const lowerQuery = query.toLowerCase();
  return POPULAR_STICKERS.filter(sticker => 
    sticker.name.toLowerCase().includes(lowerQuery) ||
    sticker.team?.toLowerCase().includes(lowerQuery) ||
    sticker.player?.toLowerCase().includes(lowerQuery) ||
    sticker.tournament?.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Získá sticker podle Class ID
 */
export function getStickerByClassId(classId: string): StickerData | undefined {
  return POPULAR_STICKERS.find(s => s.classId === classId);
}

