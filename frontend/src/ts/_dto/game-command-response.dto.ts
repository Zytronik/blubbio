import { NETWORK_COMMAND } from "../_enum/networkCommand";

export class GameCommandResponseDto {
    command!: NETWORK_COMMAND;
    username!: string;
}