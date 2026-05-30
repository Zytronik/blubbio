import { ApiProperty } from "@nestjs/swagger";
import { Session } from "../../types/session/session.type";

export class UpdateUserResponseDto {
  @ApiProperty()
  session!: Session;
}
