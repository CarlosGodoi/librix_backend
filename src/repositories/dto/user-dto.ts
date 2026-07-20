import type { Profile, Status } from '../../../generated/prisma/enums';

export interface IUpdatedUserDTO {
  id?: string;
  name: string;
  email: string;
  phone: string;
  profile: Profile;
  situation: Status;
}
