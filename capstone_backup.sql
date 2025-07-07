--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.5 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- Name: administrators; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.administrators (
    id integer NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_super_admin boolean DEFAULT false
);


ALTER TABLE public.administrators OWNER TO postgres;

--
-- Name: administrators_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.administrators_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.administrators_id_seq OWNER TO postgres;

--
-- Name: administrators_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.administrators_id_seq OWNED BY public.administrators.id;


--
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.courses (
    course_id integer NOT NULL,
    string_id character varying(50),
    title character varying(255) NOT NULL,
    description text,
    schedule character varying(100),
    classroom_number character varying(50),
    maximum_capacity integer,
    credit_hours integer,
    tuition_cost numeric(10,2),
    CONSTRAINT courses_credit_hours_check CHECK ((credit_hours > 0)),
    CONSTRAINT courses_maximum_capacity_check CHECK ((maximum_capacity > 0)),
    CONSTRAINT courses_tuition_cost_check CHECK ((tuition_cost >= (0)::numeric))
);


ALTER TABLE public.courses OWNER TO postgres;

--
-- Name: courses_course_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.courses_course_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.courses_course_id_seq OWNER TO postgres;

--
-- Name: courses_course_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.courses_course_id_seq OWNED BY public.courses.course_id;


--
-- Name: user_courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_courses (
    user_id integer NOT NULL,
    course_code character varying(50) NOT NULL
);


ALTER TABLE public.user_courses OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: administrators id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrators ALTER COLUMN id SET DEFAULT nextval('public.administrators_id_seq'::regclass);


--
-- Name: courses course_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses ALTER COLUMN course_id SET DEFAULT nextval('public.courses_course_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: administrators; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.administrators (id, first_name, last_name, email, password, created_at, is_super_admin) FROM stdin;
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.courses (course_id, string_id, title, description, schedule, classroom_number, maximum_capacity, credit_hours, tuition_cost) FROM stdin;
1	CSCI-1001	Introduction to Computer Science	This course introduces students to the fundamental concepts behind computers and computer programming. Topics include basic programming logic, algorithm development, computer architecture, and software engineering.	MWF 9-10	LAB-123	2	3	900.00
2	CSCI-2001	Data Structures	This course covers the basics of data structures, algorithms, and data manipulation. Topics include linked lists, stacks, queues, trees, and hash tables. Students will also learn algorithms for sorting and searching data.	TTH 10-11	LAB-456	30	3	900.00
3	CSCI-2003	Computer Architecture	This course provides an overview of modern computer systems. Topics include assembly language, memory, CPU, and input/output devices.	MWF 8-9	LAB-789	20	3	900.00
4	CSCI-2005	Advanced Algorithms	This course covers advanced algorithms for problem-solving. Topics include graph theory, dynamic programming, and machine learning.	MWF 9-10	LAB-1011	30	3	900.00
5	CSCI-2007	Networking & Security	This course introduces basic networking concepts and network security principles, including encryption and authentication.	MWF 10-11	LAB-1213	30	3	900.00
6	CSCI-2009	Object-Oriented Programming	An introduction to object-oriented programming, covering classes, inheritance, polymorphism, exception handling, and GUI programming.	TTH 9-10	LAB-1415	25	3	900.00
7	CSCI-2011	Database Design & Management	Introduction to relational database design and management. Topics include database architecture, query languages, and normalization.	MWF 1-2	LAB-1617	30	3	900.00
8	CSCI-2013	Software Engineering	Fundamentals of software engineering, including software development processes, requirements engineering, software design, testing, and maintenance.	TTH 1-2	LAB-1819	30	4	1200.00
9	CSCI-2015	Operating Systems	Overview of operating systems, including processes, threads, memory management, file systems, and virtual memory.	MWF 9-10	LAB-2021	15	4	1200.00
10	CSCI-2121	Computer Graphics	Fundamentals of 2D and 3D graphics algorithms and techniques, including rendering, texture mapping, and shading.	MWF 9-10	LAB-2223	13	3	900.00
11	CSCI-2101	Software Testing & Verification	Overview of software testing and verification techniques, including test planning, debugging, and reliability analysis.	TH 8-9	LAB-2425	15	3	900.00
12	CSCI-2201	Compiler Design	Introduction to building a compiler, covering lexical analysis, parsing, code generation, and optimization.	MWF 11-12	LAB-2627	13	4	1200.00
13	CSCI-2301	Artificial Intelligence	Introduction to AI concepts, including search algorithms, knowledge representation, decision-making, and machine learning.	MWF 9-10	LAB-2829	30	4	1200.00
14	CSCI-2401	Computer Vision	Introduction to image processing, object recognition, and 3D reconstruction.	MWF 9-10	LAB-3031	30	3	900.00
15	CSCI-2501	Systems Programming	Covers memory management, system calls, I/O, and debugging for efficient, robust, and maintainable code.	TTH 11-12	LAB-3233	25	4	1200.00
16	CSCI-2601	Machine Learning	Introduction to supervised learning, unsupervised learning, and deep learning.	TTH 9-10	LAB-3435	30	4	1200.00
17	CSCI-2701	Parallel Computing	Fundamentals of parallel computing, including threading, synchronization, and optimization.	MWF 10-11	LAB-3905	30	4	1200.00
18	ISYS-1001	Introduction to Information Systems	Basics of Information Systems, including system development, data modeling, and user interface design.	MWF 2-3	LAB-3031	30	3	900.00
19	ISYS-1003	Computer Networking	Fundamentals of computer networking, including LANs, WANs, protocols, and security.	MWF 9-10	LAB-3233	15	3	900.00
20	ISYS-2000	Database Design and Management	Concepts of database design, SQL, normalization, and database security.	MWF 9-10	LAB-3435	13	3	900.00
21	CSCI-2300	Web Design and Development	Overview of web development principles, including HTML, CSS, JavaScript, and UX design.	TTH 2-3	LAB-3905	15	3	900.00
22	CSCI-2421	Systems Analysis and Design	Introduction to SA&D techniques, covering project planning, data modeling, and system architecture.	MWF 8-9	LAB-3031	30	3	900.00
\.


--
-- Data for Name: user_courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_courses (user_id, course_code) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, first_name, last_name, email, password, created_at) FROM stdin;
1	John	Wayne	john@gmail.com	$2b$10$pJs2Z9X2Af6J/wEVlbw8weSoxu4mU2Tke.kKLKU8xkY73n0uaHJQK	2025-05-31 16:09:46.175793
\.


--
-- Name: administrators_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.administrators_id_seq', 1, false);


--
-- Name: courses_course_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.courses_course_id_seq', 22, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: administrators administrators_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrators
    ADD CONSTRAINT administrators_email_key UNIQUE (email);


--
-- Name: administrators administrators_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrators
    ADD CONSTRAINT administrators_pkey PRIMARY KEY (id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (course_id);


--
-- Name: user_courses user_courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_courses
    ADD CONSTRAINT user_courses_pkey PRIMARY KEY (user_id, course_code);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: user_courses user_courses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_courses
    ADD CONSTRAINT user_courses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

