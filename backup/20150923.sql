--
-- PostgreSQL database dump
--

-- Dumped from database version 9.4.4
-- Dumped by pg_dump version 9.4.4
-- Started on 2015-09-23 07:57:31

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 179 (class 3079 OID 11855)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2041 (class 0 OID 0)
-- Dependencies: 179
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 177 (class 1259 OID 16447)
-- Name: chain; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE chain (
    chain_id integer NOT NULL,
    name character varying
);


ALTER TABLE chain OWNER TO postgres;

--
-- TOC entry 176 (class 1259 OID 16445)
-- Name: chain_chain_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE chain_chain_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE chain_chain_id_seq OWNER TO postgres;

--
-- TOC entry 2042 (class 0 OID 0)
-- Dependencies: 176
-- Name: chain_chain_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE chain_chain_id_seq OWNED BY chain.chain_id;


--
-- TOC entry 174 (class 1259 OID 16433)
-- Name: puser; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE puser (
    user_id integer NOT NULL,
    name character varying
);


ALTER TABLE puser OWNER TO postgres;

--
-- TOC entry 178 (class 1259 OID 16458)
-- Name: puser_chain; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE puser_chain (
    user_id integer,
    chain_id integer
);


ALTER TABLE puser_chain OWNER TO postgres;

--
-- TOC entry 173 (class 1259 OID 16412)
-- Name: tag; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE tag (
    tag_id integer NOT NULL,
    file_id character varying(15) DEFAULT NULL::character varying,
    url character varying(255) DEFAULT NULL::character varying,
    window_width integer,
    window_height integer,
    share_status character varying(45) DEFAULT NULL::character varying,
    pulse_text text,
    thoughts text,
    zoom character varying(45) DEFAULT NULL::character varying,
    pulsepos character varying(255) DEFAULT NULL::character varying,
    "timestamp" timestamp without time zone
);


ALTER TABLE tag OWNER TO postgres;

--
-- TOC entry 172 (class 1259 OID 16410)
-- Name: tag_tag_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE tag_tag_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tag_tag_id_seq OWNER TO postgres;

--
-- TOC entry 2043 (class 0 OID 0)
-- Dependencies: 172
-- Name: tag_tag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE tag_tag_id_seq OWNED BY tag.tag_id;


--
-- TOC entry 175 (class 1259 OID 16436)
-- Name: user_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE user_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE user_user_id_seq OWNER TO postgres;

--
-- TOC entry 2044 (class 0 OID 0)
-- Dependencies: 175
-- Name: user_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE user_user_id_seq OWNED BY puser.user_id;


--
-- TOC entry 1907 (class 2604 OID 16450)
-- Name: chain_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY chain ALTER COLUMN chain_id SET DEFAULT nextval('chain_chain_id_seq'::regclass);


--
-- TOC entry 1906 (class 2604 OID 16438)
-- Name: user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY puser ALTER COLUMN user_id SET DEFAULT nextval('user_user_id_seq'::regclass);


--
-- TOC entry 1900 (class 2604 OID 16415)
-- Name: tag_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY tag ALTER COLUMN tag_id SET DEFAULT nextval('tag_tag_id_seq'::regclass);


--
-- TOC entry 2032 (class 0 OID 16447)
-- Dependencies: 177
-- Data for Name: chain; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY chain (chain_id, name) FROM stdin;
\.


--
-- TOC entry 2045 (class 0 OID 0)
-- Dependencies: 176
-- Name: chain_chain_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('chain_chain_id_seq', 1, false);


--
-- TOC entry 2029 (class 0 OID 16433)
-- Dependencies: 174
-- Data for Name: puser; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY puser (user_id, name) FROM stdin;
\.


--
-- TOC entry 2033 (class 0 OID 16458)
-- Dependencies: 178
-- Data for Name: puser_chain; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY puser_chain (user_id, chain_id) FROM stdin;
\.


--
-- TOC entry 2028 (class 0 OID 16412)
-- Dependencies: 173
-- Data for Name: tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY tag (tag_id, file_id, url, window_width, window_height, share_status, pulse_text, thoughts, zoom, pulsepos, "timestamp") FROM stdin;
1	abc	\N	\N	\N	\N	\N	\N	\N	\N	\N
2	92Tp6U30MGvOFG8	http://localhost:1111/dre	933	934		Photo\n    \n            \n            \n            \n    \n        \n                Dr. Dre at the movie premiere for “Straight Outta Compton.”\n                        \n            Credit\n            Kevin Winter/Getty Images        \n            \n    \n            \n                                                                            \n    Advertisement\n\nContinue reading the main story\n\n                                                                                                \n        \n\n        \n                                                    \nContinue reading the main story\nShare This Page\n\nContinue reading the main story\n\n\nContinue reading the main story\n\n\n                    \n\n\n                \n        For Dr. Dre, this summer was meant to be a victory lap in a successful career. The movie “Straight Outta Compton,” a biopic about his hip-hop group, N.W.A., topped the box office last week with a $56.1 million opening and was praised for its raw and timely depiction of police harassment against black men. Its quasi-soundtrack, “Compton,” his first album in 16 years, debuted at No. 2 on the Billboard chart. Last year, the music company that Dr. Dre helped establish, Beats, was sold to Apple for $3 billion, making him the self-proclaimed “first billionaire in hip-hop.”But critics have charged that the movie, which was co-produced by Dr. Dre, glosses over N.W.A.’s record of misogyny and ignores allegations, including criminal charges, that Dr. Dre physically abused women. Their ad hoc campaign, conducted mostly online, has managed to shift the focus from his accomplishments to his less pristine past in the often lawless early years of gangster rap.    \n        \n            Continue reading the main story\n\n                \n        \n                            Related Coverage\n                    \n    \n\n            \n                                                            \n\n    \n\n                    \n                \n                \n            \n        \n        \n                        Review: In ‘Straight Outta Compton,’ Upstarts Who Became the EstablishmentAUG. 13, 2015\n        \n\n    \n\n\n                                                                                \n\n    \n\n                    \n                \n                \n            \n        \n        \n                        Review: ‘Compton,’ Dr. Dre’s First Album in 16 YearsAUG. 7, 2015\n        \n\n    \n\n\n                                                                                \n\n    \n\n                    \n                \n                \n            \n        \n        \n                        Straight Outta History, the Rage That Makes MoviesAUG. 11, 2015\n        \n\n    \n\n\n                                                                                \n\n    \n\n                    \n                \n                \n            \n        \n        \n                        An N.W.A. Biopic Heads Straight Into MainstreamAUG. 6, 2015\n        \n\n    \n\n\n                                                \n        \n    \nIn a sign that the uproar was threatening not only his reputation but also his business dealings, Dr. Dre, who has previously spoken dismissively or vaguely about the allegations, which are decades old, confronted them on Friday in a statement to The New York Times. While he did not address each allegation individually, he said: “Twenty-five years ago I was a young man drinking too much and in over my head with no real structure in my life. However, none of this is an excuse for what I did. I’ve been married for 19 years and every day I’m working to be a better man for my family, seeking guidance along the way. I’m doing everything I can so I never resemble that man again.”\n    Photo\n    \n            \n            \n            \n    \n        \n                Corey Hawkins as Dr. Dre, in a scene from the film, “Straight Outta Compton."\n                        \n            Credit\n            Jaimie Trueblood/Universal Pictures        \n            \n    \nHe added: “I apologize to the women I’ve hurt. I deeply regret what I did and know that it has forever impacted all of our lives.”Apple, where Dr. Dre, 50, now works as a top consultant, also issued a statement: “Dre has apologized for the mistakes he’s made in the past and he’s said that he’s not the same person that he was 25 years ago. We believe his sincerity and after working with him for a year and a half, we have every reason to believe that he has changed.”\n    Advertisement\n\nContinue reading the main story\nThis is the latest case of a celebrity who, partly because of the Internet, has had to face old abuse allegations. And for the accusers, Dr. Dre’s statement may be an acknowledgment of what they said decades ago.In interviews with The Times this week, the women at the center of the allegations — the hip-hop journalist Dee Barnes; Michel’le, an R&B singer and Dr. Dre’s former girlfriend; and Tairrie B, a onetime labelmate — spoke about the abuse and about how social media had helped them connect and spread their stories.“I’ve been talking about my abuse for many, many years, but it has not gotten any ears until now,” said Michel’le, who was romantically involved with Dr. Dre from the late-’80s until the mid-’90s. (They have an adult son.)During that time, she said, he was often physically abusive, hitting her with a closed fist and leaving “black eyes, a cracked rib and scars.” Michel’le said she never pressed charges because, “We don’t get that kind of education in my culture.”\n    Advertisement\n\nContinue reading the main story\nShe added, “Opening up and finding out there were other women like me gave me the power to speak up.”Tairrie B (her real name is Theresa Murphy) said that Dr. Dre punched her twice in the face at a Grammys after-party in 1990 after she recorded a track insulting him.She connected with Ms. Barnes through Facebook last year. “I said, ‘Hey girl, I think we have something in common, and we’ve never talked about it,’ ” Ms. Murphy said.Ms. Barnes recalled being brought to tears by that message and a subsequent hourslong phone conversation with Ms. Murphy. Both women were writing memoirs — Ms. Barnes’s is tentatively titled “Music, Myth and Misogyny” — but did not expect to wage a public campaign against Dr. Dre, she said.“The initial conversation was like group therapy, to heal our wounds,” Ms. Barnes said.As the Aug. 14 release of “Straight Outta Compton” approached, others started the discussion. A blog post from last year by the rap writer Byron Crawford, titled “Beatings by Dre,” began to circulate again on Twitter and Facebook, while a Gawker post headlined “Remember When Dr. Dre Bashed a Female Journalist’s Face Against a Wall?” was published on July 31 and was viewed nearly 300,000 times. (In format, it mirrored a Gawker article from early 2014: “Who Wants to Remember Bill Cosby’s Multiple Sex-Assault Accusations?”)At a panel for “Straight Outta Compton” this month, the film’s director, F. Gary Gray, was asked why the film omitted Ms. Barnes’s story, in which Dr. Dre confronted her at a party in 1991 about an N.W.A. segment on her Fox show “Pump It Up!”According to a statement Ms. Barnes issued at the time, Dr. Dre began punching her in the head and “slamming her face and the right side of her body repeatedly against a wall.” (Charged with assault and battery, he pleaded no contest. He was sentenced to community service and probation, fined $2,500 and ordered to make a domestic violence P.S.A.; a civil suit was settled out of court.)Mr. Gray said at the panel that the filmmakers had “talked about it at the beginning” — the scene appeared in an early script — but ultimately decided the movie “wasn’t about a lot of side stories.” He added, “You can make five different N.W.A. movies — we made the one we wanted to make.” (Through Universal Studios, Mr. Gray declined to comment.)Sensing the renewed interest, Ms. Murphy encouraged Ms. Barnes to tell her side. “It’s about finally getting the truth out there,” Ms. Murphy said.On Tuesday, Ms. Barnes published an essay on Gawker about the film and her assault that was seen more than 1.6 million times. “I suffer from horrific migraines that started only after the attack,” she wrote. “My head does ring and it hurts, exactly in the same spot every time where he smashed my head against the wall.”She called the movie “revisionist history,” lamenting the women, including Ms. Murphy and Michel’le, who were written out. The movie “wasn’t reality and it wasn’t gangster,” Ms. Barnes said. “Gangster would have been to show everything.”\n    Advertisement\n\nContinue reading the main story\n\n    \t\n    Advertisement\n\nContinue reading the main story\nAs a white, female rapper signed to Ruthless Records, N.W.A.’s record label, Ms. Murphy said she had been expected to collaborate with Dr. Dre, but resisted his creative control. “He was very nasty to me constantly,” she said, and so she decided to address his chauvinism on the song “Ruthless Bitch.”When Dr. Dre said at a crowded party that he’d heard the track, the pair began arguing. “I stood up to him, and I didn’t back down,” Ms. Murphy said. “He kept saying, ‘If you say one more word to me ...” Then, she said, “he punched me right in the mouth and again in the eye.”While Ms. Murphy did not file a police report — “There’s no excuse, but this was a different time,” she said — a meeting was scheduled the next day with Eazy-E, a founder of N.W.A., and Jerry Heller, N.W.A.’s manager and a founder of Ruthless. “I was told, ‘This is a family business — you’re not pressing charges,” she said. “I was taken care of by Eazy in certain ways to be quiet.” (Mr. Heller did not respond to requests for comment. Eazy-E died in 1995.)After Ms. Murphy reconnected with Ms. Barnes, “I had a lot of guilt,” she said. “Had I pressed charges, he would have had a strike against him. And maybe Michel’le would have stood up, too. Maybe it would have made him think.”Since the attack, Ms. Barnes said that she has had trouble finding work in the entertainment industry: “His career continued, where mine dwindled. People side with the money.”Still, she rejects those who say coming forward again now is opportunistic. “What opportunity?” she said. “Show me the opportunities.”She added, “They brought up the past” by making the film. “Not me.”Michel’le agreed. “They told their story,” she said. “I’m telling mine.”			{"abs":{"x":278,"y":3423},"rel":{"x":278,"y":2843.625}}	2015-09-21 22:34:53
3	phsvheoYFCFo4WL	http://localhost:1111/dre	933	934		Photo\n    \n            \n            \n            \n    \n        \n                Dr. Dre at the movie premiere for “Straight Outta Compton.”\n                        \n            Credit\n            Kevin Winter/Getty Images        \n            \n    \n            \n                                                                            \n    Advertisement\n\nContinue reading the main story\n\n                                                                                                \n        \n\n        \n                                                    \nContinue reading the main story\nShare This Page\n\nContinue reading the main story\n\n\nContinue reading the main story\n\n\n                    \n\n\n                \n        For Dr. Dre, this summer was meant to be a victory lap in a successful career. The movie “Straight Outta Compton,” a biopic about his hip-hop group, N.W.A., topped the box office last week with a $56.1 million opening and was praised for its raw and timely depiction of police harassment against black men. Its quasi-soundtrack, “Compton,” his first album in 16 years, debuted at No. 2 on the Billboard chart. Last year, the music company that Dr. Dre helped establish, Beats, was sold to Apple for $3 billion, making him the self-proclaimed “first billionaire in hip-hop.”But critics have charged that the movie, which was co-produced by Dr. Dre, glosses over N.W.A.’s record of misogyny and ignores allegations, including criminal charges, that Dr. Dre physically abused women. Their ad hoc campaign, conducted mostly online, has managed to shift the focus from his accomplishments to his less pristine past in the often lawless early years of gangster rap.    \n        \n            Continue reading the main story\n\n                \n        \n                            Related Coverage\n                    \n    \n\n            \n                                                            \n\n    \n\n                    \n                \n                \n            \n        \n        \n                        Review: In ‘Straight Outta Compton,’ Upstarts Who Became the EstablishmentAUG. 13, 2015\n        \n\n    \n\n\n                                                                                \n\n    \n\n                    \n                \n                \n            \n        \n        \n                        Review: ‘Compton,’ Dr. Dre’s First Album in 16 YearsAUG. 7, 2015\n        \n\n    \n\n\n                                                                                \n\n    \n\n                    \n                \n                \n            \n        \n        \n                        Straight Outta History, the Rage That Makes MoviesAUG. 11, 2015\n        \n\n    \n\n\n                                                                                \n\n    \n\n                    \n                \n                \n            \n        \n        \n                        An N.W.A. Biopic Heads Straight Into MainstreamAUG. 6, 2015\n        \n\n    \n\n\n                                                \n        \n    \nIn a sign that the uproar was threatening not only his reputation but also his business dealings, Dr. Dre, who has previously spoken dismissively or vaguely about the allegations, which are decades old, confronted them on Friday in a statement to The New York Times. While he did not address each allegation individually, he said: “Twenty-five years ago I was a young man drinking too much and in over my head with no real structure in my life. However, none of this is an excuse for what I did. I’ve been married for 19 years and every day I’m working to be a better man for my family, seeking guidance along the way. I’m doing everything I can so I never resemble that man again.”\n    Photo\n    \n            \n            \n            \n    \n        \n                Corey Hawkins as Dr. Dre, in a scene from the film, “Straight Outta Compton."\n                        \n            Credit\n            Jaimie Trueblood/Universal Pictures        \n            \n    \nHe added: “I apologize to the women I’ve hurt. I deeply regret what I did and know that it has forever impacted all of our lives.”Apple, where Dr. Dre, 50, now works as a top consultant, also issued a statement: “Dre has apologized for the mistakes he’s made in the past and he’s said that he’s not the same person that he was 25 years ago. We believe his sincerity and after working with him for a year and a half, we have every reason to believe that he has changed.”\n    Advertisement\n\nContinue reading the main story\nThis is the latest case of a celebrity who, partly because of the Internet, has had to face old abuse allegations. And for the accusers, Dr. Dre’s statement may be an acknowledgment of what they said decades ago.In interviews with The Times this week, the women at the center of the allegations — the hip-hop journalist Dee Barnes; Michel’le, an R&B singer and Dr. Dre’s former girlfriend; and Tairrie B, a onetime labelmate — spoke about the abuse and about how social media had helped them connect and spread their stories.“I’ve been talking about my abuse for many, many years, but it has not gotten any ears until now,” said Michel’le, who was romantically involved with Dr. Dre from the late-’80s until the mid-’90s. (They have an adult son.)During that time, she said, he was often physically abusive, hitting her with a closed fist and leaving “black eyes, a cracked rib and scars.” Michel’le said she never pressed charges because, “We don’t get that kind of education in my culture.”\n    Advertisement\n\nContinue reading the main story\nShe added, “Opening up and finding out there were other women like me gave me the power to speak up.”Tairrie B (her real name is Theresa Murphy) said that Dr. Dre punched her twice in the face at a Grammys after-party in 1990 after she recorded a track insulting him.She connected with Ms. Barnes through Facebook last year. “I said, ‘Hey girl, I think we have something in common, and we’ve never talked about it,’ ” Ms. Murphy said.Ms. Barnes recalled being brought to tears by that message and a subsequent hourslong phone conversation with Ms. Murphy. Both women were writing memoirs — Ms. Barnes’s is tentatively titled “Music, Myth and Misogyny” — but did not expect to wage a public campaign against Dr. Dre, she said.“The initial conversation was like group therapy, to heal our wounds,” Ms. Barnes said.As the Aug. 14 release of “Straight Outta Compton” approached, others started the discussion. A blog post from last year by the rap writer Byron Crawford, titled “Beatings by Dre,” began to circulate again on Twitter and Facebook, while a Gawker post headlined “Remember When Dr. Dre Bashed a Female Journalist’s Face Against a Wall?” was published on July 31 and was viewed nearly 300,000 times. (In format, it mirrored a Gawker article from early 2014: “Who Wants to Remember Bill Cosby’s Multiple Sex-Assault Accusations?”)At a panel for “Straight Outta Compton” this month, the film’s director, F. Gary Gray, was asked why the film omitted Ms. Barnes’s story, in which Dr. Dre confronted her at a party in 1991 about an N.W.A. segment on her Fox show “Pump It Up!”According to a statement Ms. Barnes issued at the time, Dr. Dre began punching her in the head and “slamming her face and the right side of her body repeatedly against a wall.” (Charged with assault and battery, he pleaded no contest. He was sentenced to community service and probation, fined $2,500 and ordered to make a domestic violence P.S.A.; a civil suit was settled out of court.)Mr. Gray said at the panel that the filmmakers had “talked about it at the beginning” — the scene appeared in an early script — but ultimately decided the movie “wasn’t about a lot of side stories.” He added, “You can make five different N.W.A. movies — we made the one we wanted to make.” (Through Universal Studios, Mr. Gray declined to comment.)Sensing the renewed interest, Ms. Murphy encouraged Ms. Barnes to tell her side. “It’s about finally getting the truth out there,” Ms. Murphy said.On Tuesday, Ms. Barnes published an essay on Gawker about the film and her assault that was seen more than 1.6 million times. “I suffer from horrific migraines that started only after the attack,” she wrote. “My head does ring and it hurts, exactly in the same spot every time where he smashed my head against the wall.”She called the movie “revisionist history,” lamenting the women, including Ms. Murphy and Michel’le, who were written out. The movie “wasn’t reality and it wasn’t gangster,” Ms. Barnes said. “Gangster would have been to show everything.”\n    Advertisement\n\nContinue reading the main story\n\n    \t\n    Advertisement\n\nContinue reading the main story\nAs a white, female rapper signed to Ruthless Records, N.W.A.’s record label, Ms. Murphy said she had been expected to collaborate with Dr. Dre, but resisted his creative control. “He was very nasty to me constantly,” she said, and so she decided to address his chauvinism on the song “Ruthless Bitch.”When Dr. Dre said at a crowded party that he’d heard the track, the pair began arguing. “I stood up to him, and I didn’t back down,” Ms. Murphy said. “He kept saying, ‘If you say one more word to me ...” Then, she said, “he punched me right in the mouth and again in the eye.”While Ms. Murphy did not file a police report — “There’s no excuse, but this was a different time,” she said — a meeting was scheduled the next day with Eazy-E, a founder of N.W.A., and Jerry Heller, N.W.A.’s manager and a founder of Ruthless. “I was told, ‘This is a family business — you’re not pressing charges,” she said. “I was taken care of by Eazy in certain ways to be quiet.” (Mr. Heller did not respond to requests for comment. Eazy-E died in 1995.)After Ms. Murphy reconnected with Ms. Barnes, “I had a lot of guilt,” she said. “Had I pressed charges, he would have had a strike against him. And maybe Michel’le would have stood up, too. Maybe it would have made him think.”Since the attack, Ms. Barnes said that she has had trouble finding work in the entertainment industry: “His career continued, where mine dwindled. People side with the money.”Still, she rejects those who say coming forward again now is opportunistic. “What opportunity?” she said. “Show me the opportunities.”She added, “They brought up the past” by making the film. “Not me.”Michel’le agreed. “They told their story,” she said. “I’m telling mine.”			{"abs":{"x":278,"y":3423},"rel":{"x":278,"y":2843.625}}	2015-09-21 22:34:53
4	zvUUR8fe0aPYfsa	http://localhost:1111/dre	933	934		On Tuesday, Ms. Barnes published an essay on Gawker about the film and her assault that was seen more than 1.6 million times. “I suffer from horrific migraines that started only after the attack,” she wrote. “My head does ring and it hurts, exactly in the same spot every time where he smashed my head against the wall.”			{"abs":{"x":146,"y":3703},"rel":{"x":146,"y":17.5625}}	2015-09-21 22:35:15
5	cwiV5Sp9jqACYR5	http://localhost:1111/dre	933	934		On Tuesday, Ms. Barnes published an essay on Gawker about the film and her assault that was seen more than 1.6 million times. “I suffer from horrific migraines that started only after the attack,” she wrote. “My head does ring and it hurts, exactly in the same spot every time where he smashed my head against the wall.”			{"abs":{"x":146,"y":3703},"rel":{"x":146,"y":17.5625}}	2015-09-21 22:35:15
6	Bap5n5NN7Js1lQs	http://localhost:1111/dre	933	934		While Ms. Murphy did not file a police report — “There’s no excuse, but this was a different time,” she said — a meeting was scheduled the next day with Eazy-E, a founder of N.W.A., and Jerry Heller, N.W.A.’s manager and a founder of Ruthless. “I was told, ‘This is a family business — you’re not pressing charges,” she said. “I was taken care of by Eazy in certain ways to be quiet.” (Mr. Heller did not respond to requests for comment. Eazy-E died in 1995.)			{"abs":{"x":551,"y":3945},"rel":{"x":551,"y":15.5625}}	2015-09-21 22:36:40
7	IthchLaS5bPQs0I	http://localhost:1111/dre	933	934		While Ms. Murphy did not file a police report — “There’s no excuse, but this was a different time,” she said — a meeting was scheduled the next day with Eazy-E, a founder of N.W.A., and Jerry Heller, N.W.A.’s manager and a founder of Ruthless. “I was told, ‘This is a family business — you’re not pressing charges,” she said. “I was taken care of by Eazy in certain ways to be quiet.” (Mr. Heller did not respond to requests for comment. Eazy-E died in 1995.)			{"abs":{"x":551,"y":3945},"rel":{"x":551,"y":15.5625}}	2015-09-21 22:36:40
8	lQLcl4G53pDCoH0	http://localhost:1111/dre	933	934		While Ms. Murphy did not file a police report — “There’s no excuse, but this was a different time,” she said — a meeting was scheduled the next day with Eazy-E, a founder of N.W.A., and Jerry Heller, N.W.A.’s manager and a founder of Ruthless. “I was told, ‘This is a family business — you’re not pressing charges,” she said. “I was taken care of by Eazy in certain ways to be quiet.” (Mr. Heller did not respond to requests for comment. Eazy-E died in 1995.)			{"abs":{"x":265,"y":3960},"rel":{"x":265,"y":30.5625}}	2015-09-21 22:37:46
9	Cc1ToaFHeKHnLoz	http://localhost:1111/dre	933	934		While Ms. Murphy did not file a police report — “There’s no excuse, but this was a different time,” she said — a meeting was scheduled the next day with Eazy-E, a founder of N.W.A., and Jerry Heller, N.W.A.’s manager and a founder of Ruthless. “I was told, ‘This is a family business — you’re not pressing charges,” she said. “I was taken care of by Eazy in certain ways to be quiet.” (Mr. Heller did not respond to requests for comment. Eazy-E died in 1995.)			{"abs":{"x":265,"y":3960},"rel":{"x":265,"y":30.5625}}	2015-09-21 22:37:46
10	4nRYQbiZCQrX6im	http://localhost:1111/dre	933	934		While Ms. Murphy did not file a police report — “There’s no excuse, but this was a different time,” she said — a meeting was scheduled the next day with Eazy-E, a founder of N.W.A., and Jerry Heller, N.W.A.’s manager and a founder of Ruthless. “I was told, ‘This is a family business — you’re not pressing charges,” she said. “I was taken care of by Eazy in certain ways to be quiet.” (Mr. Heller did not respond to requests for comment. Eazy-E died in 1995.)			{"abs":{"x":247,"y":3954},"rel":{"x":247,"y":24.5625}}	2015-09-21 22:38:31
11	YRM6K6cLTmAo3AV	http://localhost:1111/dre	933	934		do it like this?			{"abs":{"x":247,"y":3954},"rel":{"x":247,"y":24.5625}}	2015-09-21 22:38:31
12	nmkOeyUJfDW1InC	http://localhost:1111/dre	1012	934		But critics have charged that the movie, which was co-produced by Dr. Dre, glosses over N.W.A.’s record of misogyny and ignores allegations, including criminal charges, that Dr. Dre physically abused women. Their ad hoc campaign, conducted mostly online, has managed to shift the focus from his accomplishments to his less pristine past in the often lawless early years of gangster rap.			{"abs":{"x":288,"y":1454},"rel":{"x":288,"y":16.625}}	2015-09-22 08:26:18
13	Y4KtKqLAygDLZZF	http://localhost:1111/dre	1012	934		But critics have charged that the movie, which was co-produced by Dr. Dre, glosses over N.W.A.’s record of misogyny and ignores allegations, including criminal charges, that Dr. Dre physically abused women. Their ad hoc campaign, conducted mostly online, has managed to shift the focus from his accomplishments to his less pristine past in the often lawless early years of gangster rap.			{"abs":{"x":288,"y":1454},"rel":{"x":288,"y":16.625}}	2015-09-22 08:26:18
14	uSqFgwUVtkQv1Vj	http://localhost:1111/dre	1012	934		For Dr. Dre, this summer was meant to be a victory lap in a successful career. The movie “Straight Outta Compton,” a biopic about his hip-hop group, N.W.A., topped the box office last week with a $56.1 million opening and was praised for its raw and timely depiction of police harassment against black men. Its quasi-soundtrack, “Compton,” his first album in 16 years, debuted at No. 2 on the Billboard chart. Last year, the music company that Dr. Dre helped establish, Beats, was sold to Apple for $3 billion, making him the self-proclaimed “first billionaire in hip-hop.”			{"abs":{"x":101,"y":1400},"rel":{"x":101,"y":50.625}}	2015-09-22 08:29:23
15	RcZNNRrQp7j7R7X	http://localhost:1111/dre	1012	934		For Dr. Dre, this summer was meant to be a victory lap in a successful career. The movie “Straight Outta Compton,” a biopic about his hip-hop group, N.W.A., topped the box office last week with a $56.1 million opening and was praised for its raw and timely depiction of police harassment against black men. Its quasi-soundtrack, “Compton,” his first album in 16 years, debuted at No. 2 on the Billboard chart. Last year, the music company that Dr. Dre helped establish, Beats, was sold to Apple for $3 billion, making him the self-proclaimed “first billionaire in hip-hop.”			{"abs":{"x":101,"y":1400},"rel":{"x":101,"y":50.625}}	2015-09-22 08:29:23
16	DnDpe49dGFExaVU	http://localhost:1111/dre	1012	934		For Dr. Dre, this summer was meant to be a victory lap in a successful career. The movie “Straight Outta Compton,” a biopic about his hip-hop group, N.W.A., topped the box office last week with a $56.1 million opening and was praised for its raw and timely depiction of police harassment against black men. Its quasi-soundtrack, “Compton,” his first album in 16 years, debuted at No. 2 on the Billboard chart. Last year, the music company that Dr. Dre helped establish, Beats, was sold to Apple for $3 billion, making him the self-proclaimed “first billionaire in hip-hop.”			{"abs":{"x":362,"y":1396},"rel":{"x":362,"y":46.625}}	2015-09-22 08:31:25
17	TDaD1ermbpwRlWU	http://localhost:1111/dre	1012	934		For Dr. Dre, this summer was meant to be a victory lap in a successful career. The movie “Straight Outta Compton,” a biopic about his hip-hop group, N.W.A., topped the box office last week with a $56.1 million opening and was praised for its raw and timely depiction of police harassment against black men. Its quasi-soundtrack, “Compton,” his first album in 16 years, debuted at No. 2 on the Billboard chart. Last year, the music company that Dr. Dre helped establish, Beats, was sold to Apple for $3 billion, making him the self-proclaimed “first billionaire in hip-hop.”			{"abs":{"x":362,"y":1396},"rel":{"x":362,"y":46.625}}	2015-09-22 08:31:25
18	WZSVO1p4VO68U7E	http://localhost:1111/dre	1012	934		But critics have charged that the movie, which was co-produced by Dr. Dre, glosses over N.W.A.’s record of misogyny and ignores allegations, including criminal charges, that Dr. Dre physically abused women. Their ad hoc campaign, conducted mostly online, has managed to shift the focus from his accomplishments to his less pristine past in the often lawless early years of gangster rap.			{"abs":{"x":326,"y":1450},"rel":{"x":326,"y":12.625}}	2015-09-22 08:32:17
19	g7vkS9eZoLSMSxV	http://localhost:1111/dre	1012	934		Photo\n    \n            \n            \n            \n    \n        \n                Dr. Dre at the movie premiere for “Straight Outta Compton.”\n                        \n            Credit\n            Kevin Winter/Getty Images        \n            \n    \n            \n                                                                            \n    Advertisement\n\nContinue reading the main story\n\n                                                                                                \n        \n\n        \n                                                    \nContinue reading the main story\nShare This Page\n\nContinue reading the main story\n\n\nContinue reading the main story\n\n\n                    \n\n\n                \n        For Dr. Dre, this summer was meant to be a victory lap in a successful career. The movie “Straight Outta Compton,” a biopic about his hip-hop group, N.W.A., topped the box office last week with a $56.1 million opening and was praised for its raw and timely depiction of police harassment against black men. Its quasi-soundtrack, “Compton,” his first album in 16 years, debuted at No. 2 on the Billboard chart. Last year, the music company that Dr. Dre helped establish, Beats, was sold to Apple for $3 billion, making him the self-proclaimed “first billionaire in hip-hop.”But critics have charged that the movie, which was co-produced by Dr. Dre, glosses over N.W.A.’s record of misogyny and ignores allegations, including criminal charges, that Dr. Dre physically abused women. Their ad hoc campaign, conducted mostly online, has managed to shift the focus from his accomplishments to his less pristine past in the often lawless early years of gangster rap.    \n        \n            Continue reading the main story\n\n                \n        \n                            Related Coverage\n                    \n    \n\n            \n                                                            \n\n    \n\n                    \n                \n                \n            \n        \n        \n                        Review: In ‘Straight Outta Compton,’ Upstarts Who Became the EstablishmentAUG. 13, 2015\n        \n\n    \n\n\n                                                                                \n\n    \n\n                    \n                \n                \n            \n        \n        \n                        Review: ‘Compton,’ Dr. Dre’s First Album in 16 YearsAUG. 7, 2015\n        \n\n    \n\n\n                                                                                \n\n    \n\n                    \n                \n                \n            \n        \n        \n                        Straight Outta History, the Rage That Makes MoviesAUG. 11, 2015\n        \n\n    \n\n\n                                                                                \n\n    \n\n                    \n                \n                \n            \n        \n        \n                        An N.W.A. Biopic Heads Straight Into MainstreamAUG. 6, 2015\n        \n\n    \n\n\n                                                \n        \n    \nIn a sign that the uproar was threatening not only his reputation but also his business dealings, Dr. Dre, who has previously spoken dismissively or vaguely about the allegations, which are decades old, confronted them on Friday in a statement to The New York Times. While he did not address each allegation individually, he said: “Twenty-five years ago I was a young man drinking too much and in over my head with no real structure in my life. However, none of this is an excuse for what I did. I’ve been married for 19 years and every day I’m working to be a better man for my family, seeking guidance along the way. I’m doing everything I can so I never resemble that man again.”\n    Photo\n    \n            \n            \n            \n    \n        \n                Corey Hawkins as Dr. Dre, in a scene from the film, “Straight Outta Compton."\n                        \n            Credit\n            Jaimie Trueblood/Universal Pictures        \n            \n    \nHe added: “I apologize to the women I’ve hurt. I deeply regret what I did and know that it has forever impacted all of our lives.”Apple, where Dr. Dre, 50, now works as a top consultant, also issued a statement: “Dre has apologized for the mistakes he’s made in the past and he’s said that he’s not the same person that he was 25 years ago. We believe his sincerity and after working with him for a year and a half, we have every reason to believe that he has changed.”\n    Advertisement\n\nContinue reading the main story\nThis is the latest case of a celebrity who, partly because of the Internet, has had to face old abuse allegations. And for the accusers, Dr. Dre’s statement may be an acknowledgment of what they said decades ago.In interviews with The Times this week, the women at the center of the allegations — the hip-hop journalist Dee Barnes; Michel’le, an R&B singer and Dr. Dre’s former girlfriend; and Tairrie B, a onetime labelmate — spoke about the abuse and about how social media had helped them connect and spread their stories.“I’ve been talking about my abuse for many, many years, but it has not gotten any ears until now,” said Michel’le, who was romantically involved with Dr. Dre from the late-’80s until the mid-’90s. (They have an adult son.)During that time, she said, he was often physically abusive, hitting her with a closed fist and leaving “black eyes, a cracked rib and scars.” Michel’le said she never pressed charges because, “We don’t get that kind of education in my culture.”\n    Advertisement\n\nContinue reading the main story\nShe added, “Opening up and finding out there were other women like me gave me the power to speak up.”Tairrie B (her real name is Theresa Murphy) said that Dr. Dre punched her twice in the face at a Grammys after-party in 1990 after she recorded a track insulting him.She connected with Ms. Barnes through Facebook last year. “I said, ‘Hey girl, I think we have something in common, and we’ve never talked about it,’ ” Ms. Murphy said.Ms. Barnes recalled being brought to tears by that message and a subsequent hourslong phone conversation with Ms. Murphy. Both women were writing memoirs — Ms. Barnes’s is tentatively titled “Music, Myth and Misogyny” — but did not expect to wage a public campaign against Dr. Dre, she said.“The initial conversation was like group therapy, to heal our wounds,” Ms. Barnes said.As the Aug. 14 release of “Straight Outta Compton” approached, others started the discussion. A blog post from last year by the rap writer Byron Crawford, titled “Beatings by Dre,” began to circulate again on Twitter and Facebook, while a Gawker post headlined “Remember When Dr. Dre Bashed a Female Journalist’s Face Against a Wall?” was published on July 31 and was viewed nearly 300,000 times. (In format, it mirrored a Gawker article from early 2014: “Who Wants to Remember Bill Cosby’s Multiple Sex-Assault Accusations?”)At a panel for “Straight Outta Compton” this month, the film’s director, F. Gary Gray, was asked why the film omitted Ms. Barnes’s story, in which Dr. Dre confronted her at a party in 1991 about an N.W.A. segment on her Fox show “Pump It Up!”According to a statement Ms. Barnes issued at the time, Dr. Dre began punching her in the head and “slamming her face and the right side of her body repeatedly against a wall.” (Charged with assault and battery, he pleaded no contest. He was sentenced to community service and probation, fined $2,500 and ordered to make a domestic violence P.S.A.; a civil suit was settled out of court.)Mr. Gray said at the panel that the filmmakers had “talked about it at the beginning” — the scene appeared in an early script — but ultimately decided the movie “wasn’t about a lot of side stories.” He added, “You can make five different N.W.A. movies — we made the one we wanted to make.” (Through Universal Studios, Mr. Gray declined to comment.)Sensing the renewed interest, Ms. Murphy encouraged Ms. Barnes to tell her side. “It’s about finally getting the truth out there,” Ms. Murphy said.On Tuesday, Ms. Barnes published an essay on Gawker about the film and her assault that was seen more than 1.6 million times. “I suffer from horrific migraines that started only after the attack,” she wrote. “My head does ring and it hurts, exactly in the same spot every time where he smashed my head against the wall.”She called the movie “revisionist history,” lamenting the women, including Ms. Murphy and Michel’le, who were written out. The movie “wasn’t reality and it wasn’t gangster,” Ms. Barnes said. “Gangster would have been to show everything.”\n    Advertisement\n\nContinue reading the main story\n\n    \t\n    Advertisement\n\nContinue reading the main story\nAs a white, female rapper signed to Ruthless Records, N.W.A.’s record label, Ms. Murphy said she had been expected to collaborate with Dr. Dre, but resisted his creative control. “He was very nasty to me constantly,” she said, and so she decided to address his chauvinism on the song “Ruthless Bitch.”When Dr. Dre said at a crowded party that he’d heard the track, the pair began arguing. “I stood up to him, and I didn’t back down,” Ms. Murphy said. “He kept saying, ‘If you say one more word to me ...” Then, she said, “he punched me right in the mouth and again in the eye.”While Ms. Murphy did not file a police report — “There’s no excuse, but this was a different time,” she said — a meeting was scheduled the next day with Eazy-E, a founder of N.W.A., and Jerry Heller, N.W.A.’s manager and a founder of Ruthless. “I was told, ‘This is a family business — you’re not pressing charges,” she said. “I was taken care of by Eazy in certain ways to be quiet.” (Mr. Heller did not respond to requests for comment. Eazy-E died in 1995.)After Ms. Murphy reconnected with Ms. Barnes, “I had a lot of guilt,” she said. “Had I pressed charges, he would have had a strike against him. And maybe Michel’le would have stood up, too. Maybe it would have made him think.”Since the attack, Ms. Barnes said that she has had trouble finding work in the entertainment industry: “His career continued, where mine dwindled. People side with the money.”Still, she rejects those who say coming forward again now is opportunistic. “What opportunity?” she said. “Show me the opportunities.”She added, “They brought up the past” by making the film. “Not me.”Michel’le agreed. “They told their story,” she said. “I’m telling mine.”			{"abs":{"x":789,"y":1429},"rel":{"x":789,"y":849.625}}	2015-09-22 08:32:24
20	Qai4ccIShu0vSJ7	http://localhost:1111/dre	1012	934		In a sign that the uproar was threatening not only his reputation but also his business dealings, Dr. Dre, who has previously spoken dismissively or vaguely about the allegations, which are decades old, confronted them on Friday in a statement to The New York Times. While he did not address each allegation individually, he said: “Twenty-five years ago I was a young man drinking too much and in over my head with no real structure in my life. However, none of this is an excuse for what I did. I’ve been married for 19 years and every day I’m working to be a better man for my family, seeking guidance along the way. I’m doing everything I can so I never resemble that man again.”			{"abs":{"x":218,"y":2202},"rel":{"x":218,"y":26.5625}}	2015-09-22 08:32:49
21	FfzlRHnsPeTDFmC	http://localhost:1111/dre	1012	934		For Dr. Dre, this summer was meant to be a victory lap in a successful career. The movie “Straight Outta Compton,” a biopic about his hip-hop group, N.W.A., topped the box office last week with a $56.1 million opening and was praised for its raw and timely depiction of police harassment against black men. Its quasi-soundtrack, “Compton,” his first album in 16 years, debuted at No. 2 on the Billboard chart. Last year, the music company that Dr. Dre helped establish, Beats, was sold to Apple for $3 billion, making him the self-proclaimed “first billionaire in hip-hop.”			{"abs":{"x":330,"y":1367},"rel":{"x":330,"y":17.625}}	2015-09-22 08:33:04
22	42m8RUcVhhCA16d	http://localhost:1111/dre	1012	934		For Dr. Dre, this summer was meant to be a victory lap in a successful career. The movie “Straight Outta Compton,” a biopic about his hip-hop group, N.W.A., topped the box office last week with a $56.1 million opening and was praised for its raw and timely depiction of police harassment against black men. Its quasi-soundtrack, “Compton,” his first album in 16 years, debuted at No. 2 on the Billboard chart. Last year, the music company that Dr. Dre helped establish, Beats, was sold to Apple for $3 billion, making him the self-proclaimed “first billionaire in hip-hop.”			{"abs":{"x":333,"y":1375},"rel":{"x":333,"y":25.625}}	2015-09-22 08:41:45
23	n4kj7pUNNXiBTBr	http://localhost:1111/dre	933	934		For Dr. Dre, this summer was meant to be a victory lap in a successful career. The movie “Straight Outta Compton,” a biopic about his hip-hop group, N.W.A., topped the box office last week with a $56.1 million opening and was praised for its raw and timely depiction of police harassment against black men. Its quasi-soundtrack, “Compton,” his first album in 16 years, debuted at No. 2 on the Billboard chart. Last year, the music company that Dr. Dre helped establish, Beats, was sold to Apple for $3 billion, making him the self-proclaimed “first billionaire in hip-hop.”			{"abs":{"x":258,"y":1384},"rel":{"x":258,"y":34.625}}	2015-09-22 09:00:59
24	vvmlEy2adkwySFY	http://localhost:1111/dre	1104	934		But critics have charged that the movie, which was co-produced by Dr. Dre, glosses over N.W.A.’s record of misogyny and ignores allegations, including criminal charges, that Dr. Dre physically abused women. Their ad hoc campaign, conducted mostly online, has managed to shift the focus from his accomplishments to his less pristine past in the often lawless early years of gangster rap.			{"abs":{"x":694,"y":1456},"rel":{"x":694,"y":18.625}}	2015-09-22 09:31:29
25	Br069A7jexLKehc	http://localhost:1111/dre	1012	934		For Dr. Dre, this summer was meant to be a victory lap in a successful career. The movie “Straight Outta Compton,” a biopic about his hip-hop group, N.W.A., topped the box office last week with a $56.1 million opening and was praised for its raw and timely depiction of police harassment against black men. Its quasi-soundtrack, “Compton,” his first album in 16 years, debuted at No. 2 on the Billboard chart. Last year, the music company that Dr. Dre helped establish, Beats, was sold to Apple for $3 billion, making him the self-proclaimed “first billionaire in hip-hop.”			{"abs":{"x":301,"y":1403},"rel":{"x":301,"y":53.625}}	2015-09-22 15:57:25
26	K7bEZltv4h6rJYm	http://localhost:1111/dre	1179	944		Photo\n    \n            \n            \n            \n    \n        \n                Dr. Dre at the movie premiere for “Straight Outta Compton.”\n                        \n            Credit\n            Kevin Winter/Getty Images        \n            \n    \n            \n                                                                            \n    Advertisement\n\nContinue reading the main story\n\n                                                                                                \n        \n\n        \n                                                    \nContinue reading the main story\nShare This Page\n\nContinue reading the main story\n\n\nContinue reading the main story\n\n\n                    \n\n\n                \n        For Dr. Dre, this summer was meant to be a victory lap in a successful career. The movie “Straight Outta Compton,” a biopic about his hip-hop group, N.W.A., topped the box office last week with a $56.1 million opening and was praised for its raw and timely depiction of police harassment against black men. Its quasi-soundtrack, “Compton,” his first album in 16 years, debuted at No. 2 on the Billboard chart. Last year, the music company that Dr. Dre helped establish, Beats, was sold to Apple for $3 billion, making him the self-proclaimed “first billionaire in hip-hop.”But critics have charged that the movie, which was co-produced by Dr. Dre, glosses over N.W.A.’s record of misogyny and ignores allegations, including criminal charges, that Dr. Dre physically abused women. Their ad hoc campaign, conducted mostly online, has managed to shift the focus from his accomplishments to his less pristine past in the often lawless early years of gangster rap.    \n        \n            Continue reading the main story\n\n                \n        \n                            Related Coverage\n                    \n    \n\n            \n                                                            \n\n    \n\n                    \n                \n                \n            \n        \n        \n                        Review: In ‘Straight Outta Compton,’ Upstarts Who Became the EstablishmentAUG. 13, 2015\n        \n\n    \n\n\n                                                                                \n\n    \n\n                    \n                \n                \n            \n        \n        \n                        Review: ‘Compton,’ Dr. Dre’s First Album in 16 YearsAUG. 7, 2015\n        \n\n    \n\n\n                                                                                \n\n    \n\n                    \n                \n                \n            \n        \n        \n                        Straight Outta History, the Rage That Makes MoviesAUG. 11, 2015\n        \n\n    \n\n\n                                                                                \n\n    \n\n                    \n                \n                \n            \n        \n        \n                        An N.W.A. Biopic Heads Straight Into MainstreamAUG. 6, 2015\n        \n\n    \n\n\n                                                \n        \n    \nIn a sign that the uproar was threatening not only his reputation but also his business dealings, Dr. Dre, who has previously spoken dismissively or vaguely about the allegations, which are decades old, confronted them on Friday in a statement to The New York Times. While he did not address each allegation individually, he said: “Twenty-five years ago I was a young man drinking too much and in over my head with no real structure in my life. However, none of this is an excuse for what I did. I’ve been married for 19 years and every day I’m working to be a better man for my family, seeking guidance along the way. I’m doing everything I can so I never resemble that man again.”\n    Photo\n    \n            \n            \n            \n    \n        \n                Corey Hawkins as Dr. Dre, in a scene from the film, “Straight Outta Compton."\n                        \n            Credit\n            Jaimie Trueblood/Universal Pictures        \n            \n    \nHe added: “I apologize to the women I’ve hurt. I deeply regret what I did and know that it has forever impacted all of our lives.”Apple, where Dr. Dre, 50, now works as a top consultant, also issued a statement: “Dre has apologized for the mistakes he’s made in the past and he’s said that he’s not the same person that he was 25 years ago. We believe his sincerity and after working with him for a year and a half, we have every reason to believe that he has changed.”\n    Advertisement\n\nContinue reading the main story\nThis is the latest case of a celebrity who, partly because of the Internet, has had to face old abuse allegations. And for the accusers, Dr. Dre’s statement may be an acknowledgment of what they said decades ago.In interviews with The Times this week, the women at the center of the allegations — the hip-hop journalist Dee Barnes; Michel’le, an R&B singer and Dr. Dre’s former girlfriend; and Tairrie B, a onetime labelmate — spoke about the abuse and about how social media had helped them connect and spread their stories.“I’ve been talking about my abuse for many, many years, but it has not gotten any ears until now,” said Michel’le, who was romantically involved with Dr. Dre from the late-’80s until the mid-’90s. (They have an adult son.)During that time, she said, he was often physically abusive, hitting her with a closed fist and leaving “black eyes, a cracked rib and scars.” Michel’le said she never pressed charges because, “We don’t get that kind of education in my culture.”\n    Advertisement\n\nContinue reading the main story\nShe added, “Opening up and finding out there were other women like me gave me the power to speak up.”Tairrie B (her real name is Theresa Murphy) said that Dr. Dre punched her twice in the face at a Grammys after-party in 1990 after she recorded a track insulting him.She connected with Ms. Barnes through Facebook last year. “I said, ‘Hey girl, I think we have something in common, and we’ve never talked about it,’ ” Ms. Murphy said.Ms. Barnes recalled being brought to tears by that message and a subsequent hourslong phone conversation with Ms. Murphy. Both women were writing memoirs — Ms. Barnes’s is tentatively titled “Music, Myth and Misogyny” — but did not expect to wage a public campaign against Dr. Dre, she said.“The initial conversation was like group therapy, to heal our wounds,” Ms. Barnes said.As the Aug. 14 release of “Straight Outta Compton” approached, others started the discussion. A blog post from last year by the rap writer Byron Crawford, titled “Beatings by Dre,” began to circulate again on Twitter and Facebook, while a Gawker post headlined “Remember When Dr. Dre Bashed a Female Journalist’s Face Against a Wall?” was published on July 31 and was viewed nearly 300,000 times. (In format, it mirrored a Gawker article from early 2014: “Who Wants to Remember Bill Cosby’s Multiple Sex-Assault Accusations?”)At a panel for “Straight Outta Compton” this month, the film’s director, F. Gary Gray, was asked why the film omitted Ms. Barnes’s story, in which Dr. Dre confronted her at a party in 1991 about an N.W.A. segment on her Fox show “Pump It Up!”According to a statement Ms. Barnes issued at the time, Dr. Dre began punching her in the head and “slamming her face and the right side of her body repeatedly against a wall.” (Charged with assault and battery, he pleaded no contest. He was sentenced to community service and probation, fined $2,500 and ordered to make a domestic violence P.S.A.; a civil suit was settled out of court.)Mr. Gray said at the panel that the filmmakers had “talked about it at the beginning” — the scene appeared in an early script — but ultimately decided the movie “wasn’t about a lot of side stories.” He added, “You can make five different N.W.A. movies — we made the one we wanted to make.” (Through Universal Studios, Mr. Gray declined to comment.)Sensing the renewed interest, Ms. Murphy encouraged Ms. Barnes to tell her side. “It’s about finally getting the truth out there,” Ms. Murphy said.On Tuesday, Ms. Barnes published an essay on Gawker about the film and her assault that was seen more than 1.6 million times. “I suffer from horrific migraines that started only after the attack,” she wrote. “My head does ring and it hurts, exactly in the same spot every time where he smashed my head against the wall.”She called the movie “revisionist history,” lamenting the women, including Ms. Murphy and Michel’le, who were written out. The movie “wasn’t reality and it wasn’t gangster,” Ms. Barnes said. “Gangster would have been to show everything.”\n    Advertisement\n\nContinue reading the main story\n\n    \t\n    Advertisement\n\nContinue reading the main story\nAs a white, female rapper signed to Ruthless Records, N.W.A.’s record label, Ms. Murphy said she had been expected to collaborate with Dr. Dre, but resisted his creative control. “He was very nasty to me constantly,” she said, and so she decided to address his chauvinism on the song “Ruthless Bitch.”When Dr. Dre said at a crowded party that he’d heard the track, the pair began arguing. “I stood up to him, and I didn’t back down,” Ms. Murphy said. “He kept saying, ‘If you say one more word to me ...” Then, she said, “he punched me right in the mouth and again in the eye.”While Ms. Murphy did not file a police report — “There’s no excuse, but this was a different time,” she said — a meeting was scheduled the next day with Eazy-E, a founder of N.W.A., and Jerry Heller, N.W.A.’s manager and a founder of Ruthless. “I was told, ‘This is a family business — you’re not pressing charges,” she said. “I was taken care of by Eazy in certain ways to be quiet.” (Mr. Heller did not respond to requests for comment. Eazy-E died in 1995.)After Ms. Murphy reconnected with Ms. Barnes, “I had a lot of guilt,” she said. “Had I pressed charges, he would have had a strike against him. And maybe Michel’le would have stood up, too. Maybe it would have made him think.”Since the attack, Ms. Barnes said that she has had trouble finding work in the entertainment industry: “His career continued, where mine dwindled. People side with the money.”Still, she rejects those who say coming forward again now is opportunistic. “What opportunity?” she said. “Show me the opportunities.”She added, “They brought up the past” by making the film. “Not me.”Michel’le agreed. “They told their story,” she said. “I’m telling mine.”			{"abs":{"x":360,"y":1435},"rel":{"x":360,"y":855.625}}	2015-09-23 07:38:32
27	fJtSUNW2uDEMvEj	http://localhost:1111/dre	657	927		But critics have charged that the movie, which was co-produced by Dr. Dre, glosses over N.W.A.’s record of misogyny and ignores allegations, including criminal charges, that Dr. Dre physically abused women. Their ad hoc campaign, conducted mostly online, has managed to shift the focus from his accomplishments to his less pristine past in the often lawless early years of gangster rap.			{"abs":{"x":165,"y":1505},"rel":{"x":165,"y":13.625}}	2015-09-23 07:54:46
28	YLX62ReyBjREK0I	http://localhost:1111/dre	657	927		But critics have charged that the movie, which was co-produced by Dr. Dre, glosses over N.W.A.’s record of misogyny and ignores allegations, including criminal charges, that Dr. Dre physically abused women. Their ad hoc campaign, conducted mostly online, has managed to shift the focus from his accomplishments to his less pristine past in the often lawless early years of gangster rap.			{"abs":{"x":116,"y":1533},"rel":{"x":116,"y":41.625}}	2015-09-23 07:54:58
\.


--
-- TOC entry 2046 (class 0 OID 0)
-- Dependencies: 172
-- Name: tag_tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('tag_tag_id_seq', 28, true);


--
-- TOC entry 2047 (class 0 OID 0)
-- Dependencies: 175
-- Name: user_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('user_user_id_seq', 1, false);


--
-- TOC entry 1915 (class 2606 OID 16455)
-- Name: chain_pk; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY chain
    ADD CONSTRAINT chain_pk PRIMARY KEY (chain_id);


--
-- TOC entry 1909 (class 2606 OID 16427)
-- Name: tag_file_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY tag
    ADD CONSTRAINT tag_file_id_key UNIQUE (file_id);


--
-- TOC entry 1911 (class 2606 OID 16425)
-- Name: tag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY tag
    ADD CONSTRAINT tag_pkey PRIMARY KEY (tag_id);


--
-- TOC entry 1913 (class 2606 OID 16457)
-- Name: user_pk; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY puser
    ADD CONSTRAINT user_pk PRIMARY KEY (user_id);


--
-- TOC entry 1916 (class 2606 OID 16466)
-- Name: fk_puc_chainid; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY puser_chain
    ADD CONSTRAINT fk_puc_chainid FOREIGN KEY (chain_id) REFERENCES chain(chain_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 1917 (class 2606 OID 16461)
-- Name: fk_puc_userid; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY puser_chain
    ADD CONSTRAINT fk_puc_userid FOREIGN KEY (user_id) REFERENCES puser(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2040 (class 0 OID 0)
-- Dependencies: 5
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2015-09-23 07:57:32

--
-- PostgreSQL database dump complete
--

