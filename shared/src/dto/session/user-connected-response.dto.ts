import { ApiProperty } from "@nestjs/swagger";
import { Session } from "../../types/session/session.type";

export class UserConnectedResponseDto {
  @ApiProperty()
  session!: Session;
}
