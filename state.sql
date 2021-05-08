--
-- PostgreSQL database dump
--



CREATE TABLE public.state (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);



CREATE SEQUENCE public.state_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE public.state_id_seq OWNED BY public.state.id;


ALTER TABLE ONLY public.state ALTER COLUMN id SET DEFAULT nextval('public.state_id_seq'::regclass);


COPY public.state (id, name) FROM stdin;
2	Goa
3	Andhra Pradesh
4	Arunachal Pradesh
5	Assam
6	Bihar
7	Chhattisgarh
8	Gujarat
9	Haryana
10	Himachal Pradesh
11	Jharkhand
12	Karnataka
13	Kerala
14	Madhya Pradesh
15	Maharashtra
16	Manipur
17	Meghalaya
18	Mizoram
19	Nagaland
20	Odisha
21	Punjab
22	Rajasthan
23	Sikkim
24	Tamil Nadu
25	Telangana
26	Tripura
27	Uttar Pradesh
28	Uttarakhand
29	West Bengal
\.


SELECT pg_catalog.setval('public.state_id_seq', 29, true);



ALTER TABLE ONLY public.state
    ADD CONSTRAINT state_pkey PRIMARY KEY (id);


