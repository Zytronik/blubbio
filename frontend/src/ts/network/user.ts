import axios from "axios";
import { httpClient } from "./httpClient";
import { GetUserRatingResponseDto } from "../_dto/get-user-rating.response.dto";
import { GetUserProfileResponseDto } from "../_dto/get-user-profile.response.dto";

export async function fetchUserRating(userId: string): Promise<GetUserRatingResponseDto | null> {
    try {
        const res = await httpClient.get<GetUserRatingResponseDto>(`/users/${userId}/rating`);
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(error.response?.data?.message ?? 'Failed to fetch rating');
        } else {
            console.error('Unknown error while fetching rating');
        }
        return null;
    }
}

export async function fetchUserProfile(
    userId: string,
): Promise<GetUserProfileResponseDto | null> {
    try {
        const res = await httpClient.get<GetUserProfileResponseDto>(
            `/users/${userId}/profile`,
        );

        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(error.response?.data?.message ?? 'Failed to fetch profile');
        } else {
            console.error('Unknown error fetching profile');
        }
        return null;
    }
}