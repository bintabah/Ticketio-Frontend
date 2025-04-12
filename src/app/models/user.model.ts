export interface User {
    userId: number | null;  // Using number | null since it might be null for new users
    name: string;
    firstName: string;
    email: string;
    contact: string;
    role: string;
} 