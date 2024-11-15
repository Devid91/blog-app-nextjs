## Conventions

**(App pages) >> each application page for organization purpose, (Auth pages) >>for signin , logout , add username interactions**

**Api>auth>[...nextauth] for catching Google Console's route (callback)**

**user for keep a to redirect the UL to my DB for put the datas what are comes from Google and a custom elf-made Username**

**DB is for Connectiong to the DB, (auth) is redirectiong to the [...nextauth]**

**Actions(use server) for a separate file, i try to use "use server for each logic whitch has not include any JSX to send down for the Client Component or A Server Component to to separate server side logic from server or client side made UI"**

**Not include any sensitive datas even for the Server Components , make .env files**

**make not too long files and functions , instead made as short them if it is possible**

**made custom hooks especially not include too mach useEffect in the main file , rather put it to them**

**if someting became too repetative or requiree too much steps- became imperative put them extract it into a unique hook**

**I also made a Providers component for The entire app get the session and a wrapper for it, components folder for traditional React UI, Types for TS files**
