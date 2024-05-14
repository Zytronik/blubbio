import eventBus from "../page/page.event-bus";

//TODO OMAR: complete this function
export function getUserData(): PlayerData {
    const userData = eventBus.getUserData();
    let userPlayerData: PlayerData = {
        isguest: false,
        playerID: 0,
        playerName: "",
        playerRank: "",
        playerGlobalRank: 0,
        playerNationalRank: 0,
        playerGlicko: 0,
        playerRD: 0,
        playerProfilePicture: "",
        playerCountry: "",
    };
    if (userData && userData.id) {
        userPlayerData.playerID = userData.id;
        userPlayerData.playerName = userData.username;
    }
    return userPlayerData;
}

export interface PlayerData {
    isguest: boolean,
    playerID: number,
    playerName: string,
    playerRank: string,
    playerGlobalRank: number,
    playerNationalRank: number,
    playerGlicko: number,
    playerRD: number,
    playerProfilePicture: string,
    playerCountry: string,
}