--
-- PostgreSQL database dump
--

-- Dumped from database version 9.4.4
-- Dumped by pg_dump version 9.4.4
-- Started on 2015-11-10 16:12:43

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 183 (class 3079 OID 11855)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2076 (class 0 OID 0)
-- Dependencies: 183
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 176 (class 1259 OID 16447)
-- Name: chain; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE chain (
    chain_id integer NOT NULL,
    name character varying,
    "timestamp" timestamp without time zone,
    is_default boolean
);


ALTER TABLE chain OWNER TO postgres;

--
-- TOC entry 175 (class 1259 OID 16445)
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
-- TOC entry 2077 (class 0 OID 0)
-- Dependencies: 175
-- Name: chain_chain_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE chain_chain_id_seq OWNED BY chain.chain_id;


--
-- TOC entry 178 (class 1259 OID 16472)
-- Name: contact; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE contact (
    name character varying,
    email json,
    source character varying,
    contact_id integer NOT NULL
);


ALTER TABLE contact OWNER TO postgres;

--
-- TOC entry 179 (class 1259 OID 16478)
-- Name: contacts_contact_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE contacts_contact_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contacts_contact_id_seq OWNER TO postgres;

--
-- TOC entry 2078 (class 0 OID 0)
-- Dependencies: 179
-- Name: contacts_contact_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE contacts_contact_id_seq OWNED BY contact.contact_id;


--
-- TOC entry 173 (class 1259 OID 16433)
-- Name: puser; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE puser (
    user_id integer NOT NULL,
    name character varying,
    default_chain_id integer,
    user_image json
);


ALTER TABLE puser OWNER TO postgres;

--
-- TOC entry 177 (class 1259 OID 16458)
-- Name: puser_chain; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE puser_chain (
    user_id integer,
    chain_id integer,
    "timestamp" timestamp without time zone
);


ALTER TABLE puser_chain OWNER TO postgres;

--
-- TOC entry 181 (class 1259 OID 16522)
-- Name: puser_extension; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE puser_extension (
    extension_id character varying NOT NULL,
    user_id integer
);


ALTER TABLE puser_extension OWNER TO postgres;

--
-- TOC entry 180 (class 1259 OID 16511)
-- Name: session; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE session OWNER TO postgres;

--
-- TOC entry 172 (class 1259 OID 16412)
-- Name: tag; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE tag (
    file_id character varying(15) DEFAULT NULL::character varying,
    url character varying(255) DEFAULT NULL::character varying,
    share_status character varying(45) DEFAULT NULL::character varying,
    inner_text text,
    thoughts text,
    zoom character varying(45) DEFAULT NULL::character varying,
    "timestamp" timestamp without time zone,
    chain_id integer,
    tag_id character(15) NOT NULL,
    user_id integer,
    family json,
    placement json,
    image_target text,
    image_generic text,
    image_favicon text,
    page_title character(200)
);


ALTER TABLE tag OWNER TO postgres;

--
-- TOC entry 182 (class 1259 OID 41523)
-- Name: tag_comment; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE tag_comment (
    tag_id character varying(15),
    user_id integer,
    "timestamp" timestamp without time zone,
    body text,
    comment_id character varying(15) NOT NULL
);


ALTER TABLE tag_comment OWNER TO postgres;

--
-- TOC entry 174 (class 1259 OID 16436)
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
-- TOC entry 2079 (class 0 OID 0)
-- Dependencies: 174
-- Name: user_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE user_user_id_seq OWNED BY puser.user_id;


--
-- TOC entry 1925 (class 2604 OID 16450)
-- Name: chain_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY chain ALTER COLUMN chain_id SET DEFAULT nextval('chain_chain_id_seq'::regclass);


--
-- TOC entry 1926 (class 2604 OID 16480)
-- Name: contact_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY contact ALTER COLUMN contact_id SET DEFAULT nextval('contacts_contact_id_seq'::regclass);


--
-- TOC entry 1924 (class 2604 OID 16438)
-- Name: user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY puser ALTER COLUMN user_id SET DEFAULT nextval('user_user_id_seq'::regclass);


--
-- TOC entry 2062 (class 0 OID 16447)
-- Dependencies: 176
-- Data for Name: chain; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY chain (chain_id, name, "timestamp", is_default) FROM stdin;
20	behind	2015-09-29 11:28:39	f
21	My Pulse	2015-09-29 11:28:39	t
22	front	2015-09-29 19:06:47	f
24	fbi	2015-09-29 23:51:30	f
25	book maker	2015-09-29 23:53:51	f
26	whitey	2015-09-30 00:00:05	f
27	book	2015-09-30 00:01:32	f
28	life	2015-09-30 00:02:43	f
\.


--
-- TOC entry 2080 (class 0 OID 0)
-- Dependencies: 175
-- Name: chain_chain_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('chain_chain_id_seq', 28, true);


--
-- TOC entry 2064 (class 0 OID 16472)
-- Dependencies: 178
-- Data for Name: contact; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY contact (name, email, source, contact_id) FROM stdin;
\.


--
-- TOC entry 2081 (class 0 OID 0)
-- Dependencies: 179
-- Name: contacts_contact_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('contacts_contact_id_seq', 1, false);


--
-- TOC entry 2059 (class 0 OID 16433)
-- Dependencies: 173
-- Data for Name: puser; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY puser (user_id, name, default_chain_id, user_image) FROM stdin;
1	Gerren Scoon	21	{"small":"g.png", "large":"1.jpg"}
\.


--
-- TOC entry 2063 (class 0 OID 16458)
-- Dependencies: 177
-- Data for Name: puser_chain; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY puser_chain (user_id, chain_id, "timestamp") FROM stdin;
1	20	2015-09-29 11:28:39
1	21	2015-09-29 11:28:39
1	24	2015-09-29 23:51:30
1	25	2015-09-29 23:53:51
1	26	2015-09-30 00:00:05
1	27	2015-09-30 00:01:32
1	28	2015-09-30 00:02:43
\.


--
-- TOC entry 2067 (class 0 OID 16522)
-- Dependencies: 181
-- Data for Name: puser_extension; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY puser_extension (extension_id, user_id) FROM stdin;
eXtObJQGVuUVEJY	1
\.


--
-- TOC entry 2066 (class 0 OID 16511)
-- Dependencies: 180
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY session (sid, sess, expire) FROM stdin;
VgmqHXMT9eIOTMZ15_E0eqoRiRkRAXi7	{"cookie":{"originalMaxAge":2591999999,"expires":"2015-12-09T05:08:21.318Z","httpOnly":true,"path":"/"},"passport":{}}	2015-12-09 00:08:22
DzRTj1VxcTQfwtQhQjIuGk1kExTuOrYn	{"cookie":{"originalMaxAge":2591999984,"expires":"2015-12-03T01:37:21.487Z","httpOnly":true,"path":"/"},"passport":{}}	2015-12-02 20:37:22
dMLu8mBlcjjzEAWnV1jqZG8aUO8kEwzD	{"cookie":{"originalMaxAge":2592000000,"expires":"2015-12-07T17:21:48.022Z","httpOnly":true,"path":"/"},"passport":{}}	2015-12-07 12:21:49
9LELg8jTOCQ0Ts2eSB8O8BVO_zF2GBsl	{"cookie":{"originalMaxAge":2592000000,"expires":"2015-12-07T17:21:48.428Z","httpOnly":true,"path":"/"},"passport":{}}	2015-12-07 12:21:49
dCm1Rkp9UHU0RfbgHMc8NUSJkY5vbjIb	{"cookie":{"originalMaxAge":2592000000,"expires":"2015-12-07T17:21:48.525Z","httpOnly":true,"path":"/"},"passport":{}}	2015-12-07 12:21:49
\.


--
-- TOC entry 2058 (class 0 OID 16412)
-- Dependencies: 172
-- Data for Name: tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY tag (file_id, url, share_status, inner_text, thoughts, zoom, "timestamp", chain_id, tag_id, user_id, family, placement, image_target, image_generic, image_favicon, page_title) FROM stdin;
erukIvvs8Cng3e0	https://blog.wealthfront.com/2016-career-launching-companies-list/		Today we are pleased to present our fourth annual list of US mid-sized technology companies with momentum. We publish this list because we believe these companies are the ideal places for young people to start their careers. Most Wealthfront clients are in their 20s and 30s, and their financial success will primarily come from success in their professional careers. Nothing early in your career is more important than achieving success — and nothing signals success more than working for a successful company (for a complete explanation of this logic please see the post that accompanied our original list: 48 Hot Tech Companies To Build A Career).	spice		2015-10-29 20:28:02	27	slseXisQ2QiSIdd	1	[{"tagName":"p","class":[""],"index":1},{"tagName":"div","class":["pf-content"],"index":0},{"tagName":"section","class":["entry","fix"],"index":0},{"tagName":"div","class":["post-body"],"index":10},{"tagName":"article","class":["fix","post-5239","post","type-post","status-publish","format-standard","has-post-thumbnail","hentry","category-tech-startup-compensation","tag-top-companies-to-work-for","tag-top-tech-companies-in-silicon-valley","tag-wealthfront-100","tag-wealthfront-list-of-companies"],"index":0},{"tagName":"section","class":["col-left"],"id":"main","index":1},{"tagName":"div","class":["col-full"],"index":0},{"tagName":"div","class":[""],"id":"content","index":3},{"tagName":"div","class":[""],"id":"wrapper","index":2},{"tagName":"body","class":["single","single-post","postid-5239","single-format-standard","chrome","layout-left-content"],"index":0}]	{"abs":{"x":247,"y":879},"rel":{"x":124.09375,"y":55.71875},"spacing":{"left":0,"top":333},"opt":{"left":124.09375,"top":388.71875},"window":{"w":813,"h":944},"dims":{"w":469,"h":240,"ol":122.90625,"ot":823.28125,"opl":122.90625,"opt":490.28125}}	jCZC7JVRTDuR.png	\N	4ZGobIm0gRTS.png	\N
3HduVPCs6JcS7Cx	http://www.nytimes.com/2015/10/30/world/asia/china-end-one-child-policy.html?hp&action=click&pgtype=Homepage&module=first-column-region&region=top-news&WT.nav=top-news		BEIJING —  Driven by fears that an aging population could jeopardize China’s economic ascent, the Communist Party leadership ended its decades-old “one child” policy on Thursday, announcing that all married couples would be allowed to have two children.	well played china. well played.		2015-10-29 20:31:13	28	tCNv7Sgko7u3tPF	1	[{"tagName":"p","class":["story-body-text","story-content"],"id":"story-continues-1","index":6},{"tagName":"div","class":["story-body"],"id":"story-body","index":13},{"tagName":"article","class":["story","theme-main"],"id":"story","index":0},{"tagName":"main","class":["main"],"id":"main","index":0},{"tagName":"div","class":["page"],"id":"page","index":128},{"tagName":"div","class":["shell"],"id":"shell","index":11},{"tagName":"body","class":[""],"index":0}]	{"abs":{"x":401,"y":2106},"rel":{"x":219.5,"y":1724},"spacing":{"left":135,"top":0},"opt":{"left":354.5,"top":1724},"window":{"w":813,"h":944},"dims":{"w":510,"h":1781,"ol":181.5,"ot":382,"opl":46.5,"opt":382}}	nNhIBAtwTWk2.png	L5JmGwdSKxpi.png	dtNkqjMMRvtQ.png	\N
yCigTbeshAa7a8i	http://stackoverflow.com/questions/25463423/res-sendfile-absolute-path		But when I change it to res.sendFile('public/index1.html'); I get an error "TypeError: path must be absolute or specify root to res.sendFile", and index1.html is not rendered.	absolute path		2015-10-29 21:49:13	28	a1hkd6OtgUQhEvK	1	[{"tagName":"p","class":[""],"index":1},{"tagName":"div","class":["post-text"],"index":0},{"tagName":"div","class":[""],"index":0},{"tagName":"td","class":["postcell"],"index":1},{"tagName":"tr","class":[""],"index":0},{"tagName":"tbody","class":[""],"index":0},{"tagName":"table","class":[""],"index":0},{"tagName":"div","class":["question"],"id":"question","index":0},{"tagName":"div","class":[""],"id":"mainbar","index":1},{"tagName":"div","class":[""],"index":0},{"tagName":"div","class":["snippet-hidden"],"id":"content","index":5},{"tagName":"div","class":["container"],"index":30},{"tagName":"body","class":["question-page","new-topbar"],"index":0}]	{"abs":{"x":251,"y":284},"rel":{"x":175,"y":19},"spacing":{"left":0,"top":53},"opt":{"left":175,"top":72},"window":{"w":813,"h":927},"dims":{"w":660,"h":38,"ol":76,"ot":265,"opl":76,"opt":212}}	0BJ9rWMfle5g.png	o5gPrdVrlQK6.png	8TpvTxd6Qlxj.png	\N
uSCRyiJgLdyxWQc	https://theintercept.com/		The same can’t be said of a recent accident involving a U.S. military blimp in Kabul that constantly hovers over the Afghan capital. (See The Above, a short documentary from The Intercept’s Field of Vision project, also embedded below.)	whats with the blimps?		2015-11-02 20:36:37	27	DsPLw9LqDUaAfjS	1	[{"tagName":"p","class":[""],"index":2},{"tagName":"div","class":[""],"index":0},{"tagName":"div","class":["PostContent"],"index":0},{"tagName":"div","class":["Post-content-block-inner"],"index":0},{"tagName":"div","class":["Post-content-block"],"index":0},{"tagName":"div","class":["GridRow"],"index":0},{"tagName":"div","class":["GridContainer"],"index":0},{"tagName":"div","class":["Post-content-block-outer"],"index":1},{"tagName":"div","class":["Post-body"],"index":39},{"tagName":"div","class":["Post","Post--blog"],"index":0},{"tagName":"div","class":[""],"index":11},{"tagName":"div","class":["InterceptWrapper"],"index":0},{"tagName":"div","class":[""],"id":"Root","index":0},{"tagName":"body","class":[""],"index":0}]	{"abs":{"x":255,"y":1216},"rel":{"x":215,"y":43.90625},"spacing":{"left":0,"top":190},"opt":{"left":215,"top":233.90625},"window":{"w":933,"h":934},"dims":{"w":640,"h":120,"ol":40,"ot":1172.09375,"opl":40,"opt":982.09375}}	ynheEjT2dJAV.png	\N	qSL39yZUbnFU.png	\N
6eWQv6QASnVZhal	http://www.nytimes.com/2015/11/06/fashion/mens-style/nile-rodgers-still-chic-after-all-these-years.html?smid=fb-nytimes&smtyp=cur		“My attitude is that there are plenty of buildings that want to have me. Why would I want to live in a building where they don’t?” said Mr. Rogers, drawing a metaphor from Manhattan real estate, where he learned over the years that he was sometimes too famous or too black to appeal to everyone’s tastes.	cebrate?		2015-11-07 18:01:00	24	xR10TLQCFB5Gg26	1	[{"tagName":"p","class":["story-body-text","story-content"],"index":5},{"tagName":"div","class":["story-body"],"id":"story-body","index":7},{"tagName":"article","class":["story","theme-main"],"id":"story","index":0},{"tagName":"main","class":["main"],"id":"main","index":0},{"tagName":"div","class":["page"],"id":"page","index":126},{"tagName":"div","class":["shell"],"id":"shell","index":11},{"tagName":"body","class":[""],"index":0}]	{"abs":{"x":319,"y":989},"rel":{"x":93,"y":74.9375},"spacing":{"left":135,"top":598.0625},"opt":{"left":228,"top":673},"window":{"w":902,"h":944},"dims":{"w":510,"h":115,"ol":226,"ot":914.0625,"opl":91,"opt":316}}	jQnSovCuFE7z.png	44YfCKmGbaxs.png	hwtKdZa4zOHU.png	\N
X5KVIErPvnQ8Dto	http://www.nytimes.com/2015/11/08/sunday-review/the-cyberthreat-under-the-street.html		When we talk about the Internet, we talk about clouds and ether. But the Internet is not amorphous. You may access it wirelessly, but ultimately you’re relying on a bunch of physical cables that are vulnerable to attack. It’s something that’s been largely forgotten in the lather over cybersecurity. The threat is not only malicious code flowing through the pipes but also, and perhaps more critically, the pipes themselves.	cords!		2015-11-08 21:29:47	28	GLayPz4hUji559C	1	[{"tagName":"p","class":["story-body-text","story-content"],"index":3},{"tagName":"div","class":["story-body"],"id":"story-body","index":7},{"tagName":"article","class":["story","theme-main"],"id":"story","index":0},{"tagName":"main","class":["main"],"id":"main","index":0},{"tagName":"div","class":["page"],"id":"page","index":124},{"tagName":"div","class":["shell"],"id":"shell","index":11},{"tagName":"body","class":[""],"index":0}]	{"abs":{"x":370,"y":935},"rel":{"x":198.5,"y":80},"spacing":{"left":120,"top":538},"opt":{"left":318.5,"top":618},"window":{"w":1093,"h":944},"dims":{"w":532,"h":138,"ol":171.5,"ot":855,"opl":51.5,"opt":317}}	1nvDtUjQLmG7.png	5Zs47Tg3CTWT.png	wx9Krx4xp2xS.png	\N
mYc7ahEN43nlens	http://www.theatlantic.com/international/archive/2015/10/how-isis-started-syria-iraq/412042/?utm_source=SFTwitter		We have been living the Islamic State forwards, surprised at every turn, but we can perhaps begin to understand it backwards. Although ISIS took most of the world by surprise when it swept into the Iraqi city of Mosul in June 2014, the group and its forebears had been proclaiming their goals for a decade. Like many consequential events, this one didn’t sneak up on policymakers; they simply didn’t see what was taking shape in front of them. ISIS told us exactly what it was going to do, and then did it. This was a secret conspiracy hiding in plain sight.	talked it then they lived it. what do yall think.  I mean, I'm no\n supporter, but just curious.		2015-10-29 23:39:22	25	q5PM2xUdnFjK5T9	1	[{"tagName":"p","class":[""],"index":1},{"tagName":"section","class":[""],"id":"article-section-1","index":0},{"tagName":"div","class":["article-body"],"index":18},{"tagName":"article","class":[""],"id":"article","index":0},{"tagName":"div","class":[""],"id":"site","index":0},{"tagName":"body","class":["article-full","header-extended","header-flag","article-below-conflicts","header-fixed"],"id":"","index":0}]	{"abs":{"x":403,"y":1231},"rel":{"x":352,"y":173},"spacing":{"left":0,"top":168},"opt":{"left":352,"top":341},"window":{"w":1062,"h":934},"dims":{"w":630,"h":210,"ol":51,"ot":1058,"opl":51,"opt":890}}	NnoOu10tXPgu.png	dZIqZJeIB1UM.png	tztvWpzsVpOn.png	\N
9AyttKWFqMfLfqe	http://www.cbssports.com/nfl/eye-on-football/25365646/matthew-staffords-wife-slams-fired-lions-oc-calls-him-desperate		"[Lombardi] was frustrated that he couldn't put enough on Stafford's plate, [Lombardi] did not think Stafford was able to handle it," NFLN's Ian Rapoport said. "[Stafford] was not taking as much control of the offense as the coaching staff wanted."	merry christmaas		2015-11-07 17:36:29	21	dLhSYMBQiBNJAlT	1	[{"tagName":"p","class":[""],"index":8},{"tagName":"div","class":["storyCopy"],"index":7},{"tagName":"article","class":[""],"index":0},{"tagName":"div","class":[""],"id":"storyContent","index":0},{"tagName":"div","class":["column1","printerShow"],"index":0},{"tagName":"div","class":["blogBody"],"id":"layoutStory","index":0},{"tagName":"div","class":["layoutStory"],"id":"pageContainer","index":0},{"tagName":"div","class":[""],"id":"pageRow","index":3},{"tagName":"div","class":[""],"id":"mantle_skin","index":79},{"tagName":"body","class":[""],"id":"standardBody","index":0}]	{"abs":{"x":337,"y":992},"rel":{"x":324,"y":43},"spacing":{"left":0,"top":522},"opt":{"left":324,"top":565},"window":{"w":933,"h":917},"dims":{"w":640,"h":110,"ol":13,"ot":949,"opl":13,"opt":427}}	\N	BQEcrL9vQqhj.png	mrEyYs7GQzW3.png	\N
OAypcYMGnB5cpvW	http://www.amazon.com/Rubies-Costume-Inflate-Ghetto-Blaster/dp/B003E6656U/ref=pd_rhf_gw_s_cp_1?ie=UTF8&refRID=0XA7NNA48VZ7CGYC9NX3		Rubie's Costume Co Inflate. Ghetto Blaster Costume	dumb idea?		2015-10-30 01:09:23	21	4fPnDENpCBCJhI0	1	[{"tagName":"span","class":["a-size-large"],"id":"productTitle","index":0},{"tagName":"h1","class":["a-size-large","a-spacing-none"],"id":"title","index":0},{"tagName":"div","class":["a-section","a-spacing-none"],"id":"titleSection","index":0},{"tagName":"div","class":["feature"],"id":"title_feature_div","index":0},{"tagName":"div","class":["centerColAlign"],"id":"centerCol","index":138},{"tagName":"div","class":["a-container"],"index":148},{"tagName":"div","class":[""],"id":"a-page","index":1},{"tagName":"body","class":["toy","en_US","a-auix_ux_57388-c","a-aui_49697-c","a-aui_51744-c","a-aui_55624-t1","a-aui_57326-c","a-aui_58736-c","a-aui_accessibility_49860-c","a-aui_attr_validations_1_51371-c","a-aui_bolt_54706-c","a-aui_bolt_56525-t1","a-aui_ux_47524-t1","a-aui_ux_49594-c","a-aui_ux_52290-t1","a-aui_ux_56217-t1","a-aui_ux_59374-c","a-aui_ux_59797-c","a-aui_ux_60000-c","a-meter-animate"],"id":"dp","index":0}]	{"abs":{"x":472,"y":325},"rel":{"x":91.484375,"y":39},"spacing":{"left":0,"top":2},"opt":{"left":91.484375,"top":41},"window":{"w":1043,"h":830},"dims":{"w":330,"h":50,"ol":380.515625,"ot":286,"opl":380.515625,"opt":284}}	\N	\N	JDCVrxOP4FFX.png	\N
fAcFIjJZBMCeewd	http://www.wired.com/2015/10/9-halloween-meme-costumes/?mbid=social_fb#slide-1			w		2015-10-30 01:14:39	27	rVKsSrOk9hDOkfo	1	[{"tagName":"img","class":["center","relative"],"index":0},{"tagName":"div","class":["inner-slide-wrap","flex-box","align-m","justify-c","bg-gray-1"],"index":0},{"tagName":"figure","class":["slide","active","slick-slide","slick-active"],"index":1},{"tagName":"div","class":["slick-track"],"index":0},{"tagName":"div","class":["slick-list","draggable"],"index":0},{"tagName":"div","class":["gallery-slides","no-outline","pad-b-huge","slick-initialized","slick-slider"],"index":2},{"tagName":"div","class":["no-outline","wired-gallery","overflow-hide","inline-gallery","border-b","relative","ready"],"id":"","index":0},{"tagName":"header","class":["standard","mob-marg-t-med","mob-marg-b-25","med-marg-b-50","big-marg-b-50","marg-t-50","clearfix"],"id":"post-header","index":0},{"tagName":"div","class":["post","standard","site-container","marg-b-50","post-1920373","type-post","status-publish","format-standard","has-post-thumbnail","hentry","category-entertainment","tag-drake","tag-gallery","tag-halloween","tag-internet-culture","tag-jurassic-world","tag-memes","promo_status-promo"],"id":"post-1920373","index":0},{"tagName":"main","class":["site-main"],"id":"main","index":0},{"tagName":"body","class":["single","single-post","postid-1920373","single-format-standard","eric-thurm","type-post","primary-category-entertainment","category-entertainment","2015","10","9-halloween-meme-costumes","gallery-post"],"index":0}]	{"abs":{"x":538,"y":537},"rel":{"x":232.5,"y":120},"spacing":{"left":74,"top":48},"opt":{"left":306.5,"top":168},"window":{"w":1043,"h":830},"dims":{"w":582,"h":341,"ol":305.5,"ot":417,"opl":231.5,"opt":369}}	tNe6dpQl0NAc.png	hyYlEoUVqO3r.png	cxvfLg8mOtNP.png	\N
nq4uv6TbjlQOD2M	http://www.wsj.com/articles/has-the-world-lost-faith-in-capitalism-1446833869		If you want to find people who still believe in “the American dream”—the magnetic idea that anyone can build a better life for themselves and their families, regardless of circumstance—you might be best advised to travel to Mumbai. Half of the Indians in a recent poll agreed that “the next generation will probably be richer, safer and healthier than the last.”	has the world lost confidence?		2015-11-07 17:45:40	21	MxMt1wEtN5Q1ggj	1	[{"tagName":"p","class":[""],"index":0},{"tagName":"div","class":["article-wrap"],"id":"wsj-article-wrap","index":0},{"tagName":"div","class":["zonedModule"],"index":0},{"tagName":"div","class":["module"],"index":0},{"tagName":"div","class":["column","at8-col8","at12-col7","at16-col9","at16-offset1"],"index":3},{"tagName":"article","class":["column","at8-col8","at12-col11","at16-col15"],"id":"article-contents","index":0},{"tagName":"div","class":["sector"],"id":"article_sector","index":1},{"tagName":"div","class":["middleBlock"],"index":238},{"tagName":"div","class":["sliderBox"],"index":0},{"tagName":"body","class":["mouse","at8units","pageFrame","subType-unsubscribed","logged-out","fontSize-medium"],"id":"article_body","index":0}]	{"abs":{"x":323,"y":1116},"rel":{"x":182,"y":70.890625},"spacing":{"left":0,"top":527.109375},"opt":{"left":182,"top":598},"window":{"w":902,"h":944},"dims":{"w":620,"h":140,"ol":141,"ot":1045.109375,"opl":141,"opt":518}}	RCc93CXTDyiW.png	6FBuV3k0An1z.png	yH9W523w8uuO.png	\N
0TZ8Rx2TeTq4bPf	https://www.facebook.com/			so fucking true		2015-10-30 01:15:52	27	t7PqMgaifQHAQrF	1	[{"tagName":"div","class":["mtm"],"index":0},{"tagName":"div","class":[""],"index":0},{"tagName":"div","class":["mtm"],"index":0},{"tagName":"div","class":["_5r69"],"index":0},{"tagName":"div","class":[""],"index":1},{"tagName":"div","class":["_3x-2"],"index":13},{"tagName":"div","class":["_1dwg"],"index":0},{"tagName":"div","class":["userContentWrapper","_5pcr"],"index":1},{"tagName":"div","class":["_3ccb"],"id":"u_jsonp_10_d","index":0},{"tagName":"div","class":["_4-u2","mbm","_5v3q","_2l4l","_4-u8"],"id":"u_jsonp_10_c","index":0},{"tagName":"div","class":["_5jmm","_5pat","_3lb4","_x72","_50nb"],"id":"hyperfeed_story_id_5632fc76de0b92045431517","index":226},{"tagName":"div","class":[""],"index":0},{"tagName":"div","class":[""],"id":"u_jsonp_10_1","index":0},{"tagName":"div","class":[""],"index":0},{"tagName":"div","class":["_4ikz"],"id":"substream_0_5632fc76c36eb0037007813","index":2621},{"tagName":"div","class":["_5pcb"],"id":"feed_stream_5632fbedc5c276d14697074","index":0},{"tagName":"div","class":[""],"id":"topnews_main_stream_408239535924329","index":41},{"tagName":"div","class":[""],"id":"stream_pagelet","index":0},{"tagName":"div","class":[""],"id":"contentArea","index":118},{"tagName":"div","class":["clearfix","hasRightCol","_5r-_","homeWiderContent","homeFixedLayout","hasExpandedComposer","newsFeedComposer"],"id":"contentCol","index":131},{"tagName":"div","class":[""],"id":"mainContainer","index":1},{"tagName":"div","class":[""],"index":0},{"tagName":"div","class":["fb_content","clearfix"],"id":"content","index":0},{"tagName":"div","class":["uiContextualLayerParent"],"id":"globalContainer","index":99},{"tagName":"div","class":["_li"],"index":0},{"tagName":"body","class":["hasLeftCol","home","composerExpanded","_5vb_","fbx","_5p3y","chrome","webkit","win","x2","body_textalign","Locale_en_US"],"index":0}]	{"abs":{"x":408,"y":25804},"rel":{"x":212.11932373046875,"y":221.72783276265181},"spacing":{"left":0,"top":0},"opt":{"left":212.11932373046875,"top":221.72783276265181},"window":{"w":948,"h":739},"dims":{"w":470,"h":470,"ol":195.88067626953125,"ot":25582.27216723735,"opl":195.88067626953125,"opt":25582.27216723735}}	cDjw2pyTd1Nf.png	\N	D3HBaMtkFZ2W.png	\N
W8VGxoKXU3VNMIp	http://www.nytimes.com/2015/11/09/us/missouri-football-players-boycott-in-protest-of-university-president.html?ribbon-ad-idx=3&src=trending&module=Ribbon&version=context&region=Header&action=click&contentCollection=Trending&pgtype=article		COLUMBIA, Mo. —  Students at the University of Missouri have been demonstrating for weeks for the ouster of the university president, protesting the school’s handling of racial tensions. But their movement received a boost over the weekend when dozens of black football players issued a blunt ultimatum: Resign or they won’t play.	you already know what the messag will be\n		2015-11-08 22:27:37	28	T69PM5CjT1Ncg6L	1	[{"tagName":"p","class":["story-body-text","story-content"],"id":"story-continues-1","index":1},{"tagName":"div","class":["story-body"],"id":"story-body","index":7},{"tagName":"article","class":["story","theme-main"],"id":"story","index":0},{"tagName":"main","class":["main"],"id":"main","index":0},{"tagName":"div","class":["page"],"id":"page","index":125},{"tagName":"div","class":["shell"],"id":"shell","index":11},{"tagName":"body","class":[""],"index":0}]	{"abs":{"x":255,"y":414},"rel":{"x":78.5,"y":102},"spacing":{"left":120,"top":0},"opt":{"left":198.5,"top":102},"window":{"w":1103,"h":944},"dims":{"w":532,"h":207,"ol":176.5,"ot":312,"opl":56.5,"opt":312}}	yWqKRMeYTftl.png	AQHAP11OzU1O.png	5G48SGWbge33.png	No Justice, No Football on a Missouri Campus - The New York Times                                                                                                                                       
\.


--
-- TOC entry 2068 (class 0 OID 41523)
-- Dependencies: 182
-- Data for Name: tag_comment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY tag_comment (tag_id, user_id, "timestamp", body, comment_id) FROM stdin;
erher2S3K71Fu4r	1	2015-10-26 15:05:15	no frickin way dude	OtNkz1qkJ4AUGOv
erher2S3K71Fu4r	1	2015-10-26 15:14:20	I mean no freaking way!	USiS8dCyA1KATbF
erher2S3K71Fu4r	1	2015-10-26 15:14:20	I mean no freaking way!	tdoo7EE6M1FNWnG
0EJzNFN6uD2JYJZ	1	2015-10-26 18:59:38	Write something fantastic	vKdagLKWJMSD5Wk
0EJzNFN6uD2JYJZ	1	2015-10-26 19:10:29	my life is all i have	FkLyvY8mXjz5HUu
OnWF6AxbSFlBPU9	1	2015-10-26 19:11:14	what happened before this?	tmJVuLTR6MRpQBS
GSChdk94VDVZRDO	1	2015-10-26 19:49:17	I just looked at him like that	suX6oNWdvcDdq2u
GSChdk94VDVZRDO	1	2015-10-26 20:11:31	$('#active_discussion_body').html(tag.thoughts); weorjwo irwjeir wrw ;aj ritrao	JXk9miqVwvqMrA2
GSChdk94VDVZRDO	1	2015-10-26 20:12:08	probably not	tJNz5dk73G3fJMI
OnWF6AxbSFlBPU9	1	2015-10-26 20:13:18	he doesnt go as hard	MQJhRC2cTifxHNx
OnWF6AxbSFlBPU9	1	2015-10-26 20:13:39	my memory is so bad	ec2sQoHky6mRqXI
OnWF6AxbSFlBPU9	1	2015-10-26 20:28:41	what happened	7wppYMh5QCZW1US
OnWF6AxbSFlBPU9	1	2015-10-26 20:28:45	lets try this again	2Bwfn3jbIcJQ3kp
OnWF6AxbSFlBPU9	1	2015-10-26 20:29:30	she said that!!!!	zwdEZs8MsBJNPI2
GSChdk94VDVZRDO	1	2015-10-26 20:34:23	we're not conditioned	ZJLRQ3x3bJV9FvB
eJbi5mjWzQY2u5L	1	2015-10-26 22:24:34	okay okay	wzzO53ig1hoZaVb
Vb88SGVSdF3jLQ0	1	2015-10-27 18:05:08	I dont got no answers, man	qS3Nkt3C81ag8EH
Vb88SGVSdF3jLQ0	1	2015-10-27 18:06:17	you aint got the answers!!!''	3YHVoSP24G5YAws
H2Wi4whvtRP27Vd	1	2015-10-27 18:54:27	damn, everything im not makes me everything I am	uA98cVz8o1XgTZm
GSChdk94VDVZRDO	1	2015-10-28 08:21:10	What are you saying exactly?	0yolvedKxvepTAE
H2Wi4whvtRP27Vd	1	2015-10-28 16:49:00	well alrighty	SaQYjfgGOsqi0nl
\.


--
-- TOC entry 2082 (class 0 OID 0)
-- Dependencies: 174
-- Name: user_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('user_user_id_seq', 3, true);


--
-- TOC entry 1934 (class 2606 OID 16455)
-- Name: chain_pk; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY chain
    ADD CONSTRAINT chain_pk PRIMARY KEY (chain_id);


--
-- TOC entry 1936 (class 2606 OID 16488)
-- Name: pk_contactid; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY contact
    ADD CONSTRAINT pk_contactid PRIMARY KEY (contact_id);


--
-- TOC entry 1940 (class 2606 OID 16529)
-- Name: pk_puser_ext; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY puser_extension
    ADD CONSTRAINT pk_puser_ext PRIMARY KEY (extension_id);


--
-- TOC entry 1928 (class 2606 OID 16568)
-- Name: pk_tag_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY tag
    ADD CONSTRAINT pk_tag_id PRIMARY KEY (tag_id);


--
-- TOC entry 1942 (class 2606 OID 41530)
-- Name: pk_tagcomment_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY tag_comment
    ADD CONSTRAINT pk_tagcomment_id PRIMARY KEY (comment_id);


--
-- TOC entry 1938 (class 2606 OID 16518)
-- Name: session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- TOC entry 1930 (class 2606 OID 16427)
-- Name: tag_file_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY tag
    ADD CONSTRAINT tag_file_id_key UNIQUE (file_id);


--
-- TOC entry 1932 (class 2606 OID 16457)
-- Name: user_pk; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY puser
    ADD CONSTRAINT user_pk PRIMARY KEY (user_id);


--
-- TOC entry 1946 (class 2606 OID 16466)
-- Name: fk_puc_chainid; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY puser_chain
    ADD CONSTRAINT fk_puc_chainid FOREIGN KEY (chain_id) REFERENCES chain(chain_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 1947 (class 2606 OID 16461)
-- Name: fk_puc_userid; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY puser_chain
    ADD CONSTRAINT fk_puc_userid FOREIGN KEY (user_id) REFERENCES puser(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 1948 (class 2606 OID 16530)
-- Name: fk_puser_ext_uid; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY puser_extension
    ADD CONSTRAINT fk_puser_ext_uid FOREIGN KEY (user_id) REFERENCES puser(user_id);


--
-- TOC entry 1944 (class 2606 OID 16607)
-- Name: fk_tag_chain_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY tag
    ADD CONSTRAINT fk_tag_chain_id FOREIGN KEY (chain_id) REFERENCES chain(chain_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 1943 (class 2606 OID 16579)
-- Name: fk_tag_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY tag
    ADD CONSTRAINT fk_tag_user_id FOREIGN KEY (user_id) REFERENCES puser(user_id);


--
-- TOC entry 1945 (class 2606 OID 16596)
-- Name: fk_user_chain_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY puser
    ADD CONSTRAINT fk_user_chain_id FOREIGN KEY (default_chain_id) REFERENCES chain(chain_id);


--
-- TOC entry 2075 (class 0 OID 0)
-- Dependencies: 5
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2015-11-10 16:12:43

--
-- PostgreSQL database dump complete
--

