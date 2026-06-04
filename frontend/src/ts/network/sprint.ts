import axios from "axios";
import { httpClient } from "./httpClient";
import { CreateSprintRequestDto } from "@shared/types";
import { CreateSprintResponseDto } from "@shared/types";

export async function createSprint(
    dto: CreateSprintRequestDto
): Promise<CreateSprintResponseDto | null> {
    try {
        const res = await httpClient.post<CreateSprintResponseDto>(
            "/sprint",
            dto
        );

        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(error.response?.data?.message ?? "Failed to create sprint");
        } else {
            console.error("Unknown error while creating sprint");
        }
        return null;
    }
}