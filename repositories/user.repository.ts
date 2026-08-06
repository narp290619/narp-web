import { getUserById } from "@/lib/firebase/users.service";

export async function getUser(
    userId: string,
) {
    return getUserById(userId);
}