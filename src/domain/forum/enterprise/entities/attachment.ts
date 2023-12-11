import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface IAttachment {
  title: string;
  url: string;
}

export class Attachment extends Entity<IAttachment> {
  get title() {
    return this.props.title;
  }

  get url() {
    return this.props.url;
  }

  static create(props: IAttachment, id?: UniqueEntityID) {
    const attachment = new Attachment(props, id);

    return attachment;
  }
}
