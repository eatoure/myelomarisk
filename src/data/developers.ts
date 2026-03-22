import { withBase } from "@/lib/utils";

export interface DeveloperProfile {
  name: string;
  title: string;
  bio: string;
  skills: string[];
  email: string;
  twitter: string;
  image: string;
}

export const developers: DeveloperProfile[] = [
  {
    name: "Dr. S. Vincent Rajkumar, MD",
    title: "Professor of Medicine, Hematology/Oncology, Mayo Clinic",
    bio: "S. Vincent Rajkumar, M.D., F.R.C.P.C., is Professor of Medicine at Mayo Clinic and a consultant in Hematology and Hematopathology. He chairs the Myeloma Amyloidosis Dysproteinemia Group and co-chairs the International Myeloma Working Group. His research spans clinical, epidemiologic, and laboratory studies in multiple myeloma, MGUS, and amyloidosis, with more than 800 peer reviewed publications.",
    skills: ["Clinical Research", "Epidemiology", "Hematology", "Myeloma and Amyloidosis"],
    email: "vincerk@gmail.com",
    twitter: "@MayoMyeloma",
    image: withBase("/images/team/VincentRajkumar.jpg"),
  },
  {
    name: "Dr. Shaji Kumar, MD",
    title: "Professor of Medicine, Hematology/Oncology, Mayo Clinic",
    bio: "Shaji Kumar, M.D., is Professor of Medicine at Mayo Clinic and a consultant in Hematology/Oncology. His clinical and translational research focuses on multiple myeloma and amyloidosis, including novel therapeutics, prognostic factors, and disease mechanisms. He has authored more than 500 peer reviewed publications and serves in leadership roles across major professional societies.",
    skills: ["Novel Therapeutics", "Clinical Trials", "Translational Research", "Plasma Cell Disorders"],
    email: "kumarshaji@hotmail.com",
    twitter: "@myelomaMD",
    image: withBase("/images/team/ShajiKumar.jpg"),
  },
  {
    name: "Elhadji Amadou Touré",
    title: "Data Scientist and Developer in Health Analytics",
    bio: "Elhadji Amadou Touré is a data scientist and developer in health analytics and a pre-medical student at Carleton College with a background in computer science and biochemistry. He previously served as an SREP intern at Mayo Clinic in otolaryngology and medical oncology, contributing to myeloma clinical trials and imaging research and building the MyelomaRisk tool. His work also includes health analytics at Harvard Medical School and Mass General Brigham and applied machine learning for healthcare strategy.",
    skills: ["Healthcare Analytics", "Machine Learning", "Full-Stack Development", "Clinical Research"],
    email: "tourea@carleton.edu",
    twitter: "@eamadoutoure",
    image: withBase("/images/team/AmadouToure.JPG"),
  },
];

export const authors = developers.map((developer) => ({
  name: developer.name,
  role: developer.title,
}));
