--
-- PostgreSQL database dump
--

-- Dumped from database version 16.0
-- Dumped by pg_dump version 16.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: campus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.campus (
    campus_id character varying(50) NOT NULL,
    name character varying(50),
    is_extension boolean
);


ALTER TABLE public.campus OWNER TO postgres;

--
-- Name: csd_office; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.csd_office (
    user_id character varying(50) NOT NULL,
    role integer DEFAULT 0,
    name character varying(100),
    email character varying(100),
    password character varying(100),
    CONSTRAINT csd_office_role_check CHECK ((role = ANY (ARRAY[0, 1, 2])))
);


ALTER TABLE public.csd_office OWNER TO postgres;

--
-- Name: evidence; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.evidence (
    evidence_id character varying(50) NOT NULL,
    name text,
    type character varying(10),
    section_id character varying(50),
    record_id character varying(50)
);


ALTER TABLE public.evidence OWNER TO postgres;

--
-- Name: formula_per_instrument; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.formula_per_instrument (
    formula_id character varying(50) NOT NULL,
    formula text,
    instrument_id character varying(50)
);


ALTER TABLE public.formula_per_instrument OWNER TO postgres;

--
-- Name: formula_per_section; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.formula_per_section (
    formula_id character varying(50) NOT NULL,
    formula text,
    section_id character varying(50)
);


ALTER TABLE public.formula_per_section OWNER TO postgres;

--
-- Name: instrument; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.instrument (
    instrument_id character varying(50) NOT NULL,
    section_no character varying(10),
    sdg_subtitle text,
    sdg_id character varying(50)
);


ALTER TABLE public.instrument OWNER TO postgres;

--
-- Name: options; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.options (
    option_id character varying(50) NOT NULL,
    option text,
    question_id character varying(50)
);


ALTER TABLE public.options OWNER TO postgres;

--
-- Name: question; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.question (
    question_id character varying(50) NOT NULL,
    question text,
    type character varying(20),
    suffix character varying(20),
    section_id character varying(50),
    sub_id character varying(50)
);


ALTER TABLE public.question OWNER TO postgres;

--
-- Name: records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.records (
    record_id character varying(50) NOT NULL,
    user_id character varying(50),
    status integer DEFAULT 1,
    date_submitted timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    sdg_id character varying(50),
    year integer,
    CONSTRAINT records_status_check CHECK ((status = ANY (ARRAY[1, 2, 3])))
);


ALTER TABLE public.records OWNER TO postgres;

--
-- Name: records_values; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.records_values (
    record_value_id character varying(50) NOT NULL,
    value character varying(50),
    question_id character varying(50),
    record_id character varying(50),
    campus_id character varying(255)
);


ALTER TABLE public.records_values OWNER TO postgres;

--
-- Name: sd_office; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_office (
    user_id character varying(50) NOT NULL,
    role integer DEFAULT 1,
    name character varying(100),
    email character varying(100),
    password character varying(100),
    campus_id character varying(50),
    CONSTRAINT sd_office_role_check CHECK ((role = ANY (ARRAY[0, 1, 2])))
);


ALTER TABLE public.sd_office OWNER TO postgres;

--
-- Name: sdg; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sdg (
    sdg_id character varying(50) NOT NULL,
    title character varying(50),
    number integer,
    description text
);


ALTER TABLE public.sdg OWNER TO postgres;

--
-- Name: section; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.section (
    section_id character varying(50) NOT NULL,
    content_no character varying(10),
    section_content text,
    instrument_id character varying(50)
);


ALTER TABLE public.section OWNER TO postgres;

--
-- Data for Name: campus; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.campus (campus_id, name, is_extension);
1	BatStateU - Pablo Borbon Campus	f
2	BatStateU - Alangilan Campus	f
3	BatStateU - Lipa Campus	f
4	BatStateU - Nasugbu Campus	f
10	BatStateU - Malvar Campus	f
5	BatStateU - Lemery Campus	t
6	BatStateU - Rosario Campus	t
7	BatStateU - Balayan Campus	t
8	BatStateU - Mabini Campus	t
9	BatStateU - San Juan Campus	t
11	BatStateU - Lobo Campus	t
\.


--
-- Data for Name: csd_office; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.csd_office (user_id, role, name, email, password);
001	0	CSD Office	justmyrgutierrez92@gmail.com	$2b$10$u0jAbw5mIuPbLjidsFTSHeqeLQWxHCTxk498C6DnCVeG67hGTXJyO
\.


--
-- Data for Name: evidence; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.evidence (evidence_id, name, type, section_id, record_id);
\.


--
-- Data for Name: formula_per_instrument; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.formula_per_instrument (formula_id, formula, instrument_id);
\.


--
-- Data for Name: formula_per_section; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.formula_per_section (formula_id, formula, section_id);
F934001	=IF(A1>=5,5,A1)	S149923
F608368	=IF(A2>=5,5,A2)\n	S400048
F704699	=IF(A3>=5,5,A3)\n	S281781
F249607	=IF((A1*1)+(B1*2)+(C1*3)+(D1*4)>=10,10,(A1*1)+(B1*2)+(C1*3)+(D1*4))	S518615
F793940	=IF(AND(A1>=2,B1>=1),25,IF(AND(A1>0,B1>0),10,IF(AND(A1=1,B1=1),10,IF(AND(A1=1,B1=0),10,IF(AND(A1=0,B1=1),10,IF(AND(A1=0,B1=0),0,IF(AND(A1=0,B1>1),25,IF(AND(A1>1,B1>=0),20))))))))	S438839
\.


--
-- Data for Name: instrument; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.instrument (instrument_id, section_no, sdg_subtitle, sdg_id);
I903695		Community anti-poverty programmes	SDG01
I183282		Policy addressing poverty	SDG01
I172539		Research on poverty	SDG01
\.


--
-- Data for Name: options; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.options (option_id, option, question_id);
\.


--
-- Data for Name: question; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.question (question_id, question, type, suffix, section_id, sub_id);
Q590801	No. of PPAs	Number		S149923	A1
Q942363	No. of PPAs	Number		S400048	A2
Q616340	No. of PPAs	Number		S281781	A3
Q496696	Local	Number		S518615	A1
Q217589	Regional	Number		S518615	B1
Q560144	Global	Number		S518615	D1
Q108117	National	Number		S518615	C1
Q506208	Published Research on Poverty	Number		S438839	A1
Q832712	Co-Authored with Low or Lower-Middle income country	Number		S438839	B1
\.


--
-- Data for Name: records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.records (record_id, user_id, status, date_submitted, sdg_id, year);
REC3068058	SD52421917	3	2024-10-10 04:24:16.570642	SDG01	2023
\.


--
-- Data for Name: records_values; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.records_values (record_value_id, value, question_id, record_id, campus_id);
33dfd297-bb1c-4fb8-a17c-1ad28b5330f7	0	Q590801	REC3068058	2
24bb746e-da06-48ae-9f48-326c73757f61	0	Q590801	REC3068058	7
4258dbd9-a650-4d66-8dcb-9c8517a7918d	3	Q590801	REC3068058	11
1bbac4a5-ca38-4884-9042-ddd6c048c739	3	Q590801	REC3068058	8
cc664e1b-c5ef-4ebf-9d87-5382048f208e	2	Q942363	REC3068058	2
14adbd84-cec6-4a23-aa3d-61214ebe31e4	0	Q942363	REC3068058	7
533a5679-e01d-4ffc-ba1a-eb21e302e472	78	Q942363	REC3068058	11
78754f8c-b53e-4b83-9c15-a5d05ba359c7	787	Q942363	REC3068058	8
572bc67f-2823-4412-8aa0-e6f7c1808d89	87986	Q616340	REC3068058	2
8a566366-e9af-495c-9918-2cbb35cdad43	7	Q616340	REC3068058	7
f5577f35-0708-47b2-9f42-f1d19a54914a	77	Q616340	REC3068058	11
63e3dc5d-f796-4f62-927b-4434129e2eba	0	Q616340	REC3068058	8
10cadbfb-f58a-40c4-b5b6-6430cfa8b99b	88	Q496696	REC3068058	2
138cbf93-389a-4488-840d-bed3ae4a4bdc	868	Q496696	REC3068058	7
a6119483-bc83-4bad-9e98-471d6a4bc063	868	Q496696	REC3068058	11
c9db7c19-1bca-4ebe-a5ef-82e70dbbe6c8	0	Q496696	REC3068058	8
3a3dcd1d-1191-44cd-9bd4-453f79150238	868	Q217589	REC3068058	2
49e5d33c-6662-4ee0-ba73-88e3b0957adc	86	Q217589	REC3068058	7
eb05389c-beb8-494f-80fe-7e9856d32fdd	86	Q217589	REC3068058	11
08516194-920e-43e4-a304-bcc0b245fcd0	0	Q217589	REC3068058	8
ec98043c-bb35-49cc-a2dc-5c205b0eabaa	86	Q560144	REC3068058	2
5ab8e61c-086b-40c1-8452-15534f7888ed	86	Q560144	REC3068058	7
d0f2453f-b636-446a-8222-8ad38243d32c	0	Q560144	REC3068058	11
560c4013-07e8-4525-8baf-ee7b401ecfa9	0	Q560144	REC3068058	8
111b3ea2-bdce-4cb4-ad98-c8c73d2d0423	0	Q108117	REC3068058	2
80034248-4684-4583-a9fd-c58aa302a495	0	Q108117	REC3068058	7
9b692067-bfa6-4a5b-a20a-1026be0c47e7	0	Q108117	REC3068058	11
da2bd74a-ba16-4ffb-a9dc-852ac4c0a7d4	0	Q108117	REC3068058	8
b4851404-d247-41e3-a5c8-1d6f51d17b37	7	Q506208	REC3068058	2
1fe94c5f-42fc-46fb-a4eb-96f6f6ff22fa	0	Q506208	REC3068058	7
ed009f21-dedf-4190-a64e-3df894fc0bab	0	Q506208	REC3068058	11
691024c3-5bf4-4057-a180-4d08ebcc3b83	0	Q506208	REC3068058	8
7d53bb9a-a601-4e73-b5ec-79ad6934256e	0	Q832712	REC3068058	2
5ecf5959-72ef-4f8e-a829-cfbea6c99261	0	Q832712	REC3068058	7
8ca92a2b-8001-44df-89a4-9bd5b9a09b89	0	Q832712	REC3068058	11
e935528c-b83e-42a1-a11a-0c4516f81b20	0	Q832712	REC3068058	8
\.


--
-- Data for Name: sd_office; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_office (user_id, role, name, email, password, campus_id);
SD52421917	1	Justmyr Dimasacat Gutierrez	justmyrd.gutierrez@gmail.com	$2b$10$PhZ/8wgB2zurxJuouRFvwu5g4GgU4OE7r3o6P4EQ/p47q28YgwAYq	2
\.


--
-- Data for Name: sdg; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sdg (sdg_id, title, number, description);
SDG01	No Poverty	1	\N
SDG02	Zero Hunger	2	\N
SDG03	Good Health and Well-being	3	\N
SDG04	Quality Education	4	\N
SDG05	Gender Equality	5	\N
SDG06	Clean Water and Sanitation	6	\N
SDG07	Affordable and Clean Energy	7	\N
SDG08	Decent Work and Economic Growth	8	\N
SDG09	Industry, Innovation, and Infrastructure	9	\N
SDG10	Reduced Inequality	10	\N
SDG11	Sustainable Cities and Communities	11	\N
SDG12	Responsible Consumption and Production	12	\N
SDG13	Climate Action	13	\N
SDG14	Life Below Water	14	\N
SDG15	Life on Land	15	\N
SDG16	Peace, Justice, and Strong Institutions	16	\N
SDG17	Partnerships for the Goals	17	\N
\.


--
-- Data for Name: section; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.section (section_id, content_no, section_content, instrument_id);
S149923		Local Start-Up Assistance	I903695
S400048		Programmes for services access (extension services)	I903695
S281781		Participation in policy addressing poverty	I903695
S518615		Participation in policy addressing poverty	I183282
S438839		Research on poverty	I172539
\.


--
-- Name: campus campus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campus
    ADD CONSTRAINT campus_pkey PRIMARY KEY (campus_id);


--
-- Name: csd_office csd_office_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.csd_office
    ADD CONSTRAINT csd_office_pkey PRIMARY KEY (user_id);


--
-- Name: evidence evidence_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evidence
    ADD CONSTRAINT evidence_pkey PRIMARY KEY (evidence_id);


--
-- Name: formula_per_instrument formula_per_instrument_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formula_per_instrument
    ADD CONSTRAINT formula_per_instrument_pkey PRIMARY KEY (formula_id);


--
-- Name: formula_per_section formula_per_section_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formula_per_section
    ADD CONSTRAINT formula_per_section_pkey PRIMARY KEY (formula_id);


--
-- Name: instrument instrument_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.instrument
    ADD CONSTRAINT instrument_pkey PRIMARY KEY (instrument_id);


--
-- Name: options options_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.options
    ADD CONSTRAINT options_pkey PRIMARY KEY (option_id);


--
-- Name: question question_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.question
    ADD CONSTRAINT question_pkey PRIMARY KEY (question_id);


--
-- Name: records records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.records
    ADD CONSTRAINT records_pkey PRIMARY KEY (record_id);


--
-- Name: records_values records_values_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.records_values
    ADD CONSTRAINT records_values_pkey PRIMARY KEY (record_value_id);


--
-- Name: sd_office sd_office_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_office
    ADD CONSTRAINT sd_office_pkey PRIMARY KEY (user_id);


--
-- Name: sdg sdg_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sdg
    ADD CONSTRAINT sdg_pkey PRIMARY KEY (sdg_id);


--
-- Name: section section_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.section
    ADD CONSTRAINT section_pkey PRIMARY KEY (section_id);


--
-- Name: evidence evidence_record_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evidence
    ADD CONSTRAINT evidence_record_id_fkey FOREIGN KEY (record_id) REFERENCES public.records(record_id);


--
-- Name: evidence evidence_section_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evidence
    ADD CONSTRAINT evidence_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.section(section_id);


--
-- Name: records_values fk_campus; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.records_values
    ADD CONSTRAINT fk_campus FOREIGN KEY (campus_id) REFERENCES public.campus(campus_id);


--
-- Name: records fk_sdg; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.records
    ADD CONSTRAINT fk_sdg FOREIGN KEY (sdg_id) REFERENCES public.sdg(sdg_id);


--
-- Name: formula_per_instrument formula_per_instrument_instrument_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formula_per_instrument
    ADD CONSTRAINT formula_per_instrument_instrument_id_fkey FOREIGN KEY (instrument_id) REFERENCES public.instrument(instrument_id);


--
-- Name: formula_per_section formula_per_section_section_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formula_per_section
    ADD CONSTRAINT formula_per_section_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.section(section_id);


--
-- Name: instrument instrument_sdg_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.instrument
    ADD CONSTRAINT instrument_sdg_id_fkey FOREIGN KEY (sdg_id) REFERENCES public.sdg(sdg_id);


--
-- Name: options options_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.options
    ADD CONSTRAINT options_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.question(question_id);


--
-- Name: question question_section_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.question
    ADD CONSTRAINT question_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.section(section_id);


--
-- Name: records records_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.records
    ADD CONSTRAINT records_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.sd_office(user_id);


--
-- Name: records_values records_values_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.records_values
    ADD CONSTRAINT records_values_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.question(question_id);


--
-- Name: records_values records_values_record_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.records_values
    ADD CONSTRAINT records_values_record_id_fkey FOREIGN KEY (record_id) REFERENCES public.records(record_id);


--
-- Name: sd_office sd_office_campus_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_office
    ADD CONSTRAINT sd_office_campus_id_fkey FOREIGN KEY (campus_id) REFERENCES public.campus(campus_id);


--
-- Name: section section_instrument_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.section
    ADD CONSTRAINT section_instrument_id_fkey FOREIGN KEY (instrument_id) REFERENCES public.instrument(instrument_id);


--
-- PostgreSQL database dump complete
--

