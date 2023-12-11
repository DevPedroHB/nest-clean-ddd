import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { QuestionFactory } from "test/factories/make-question";
import { QuestionCommentFactory } from "test/factories/make-question-comment";
import { UserFactory } from "test/factories/make-user";

describe("Delete question comment (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let questionFactory: QuestionFactory;
  let questionCommentFactory: QuestionCommentFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, QuestionFactory, QuestionCommentFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    userFactory = moduleRef.get(UserFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    questionCommentFactory = moduleRef.get(QuestionCommentFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[DELETE] /comments/:id/questions", async () => {
    const user = await userFactory.makePrismaUser();
    const accessToken = jwt.sign({
      sub: user.id.toString(),
    });
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });
    const comment = await questionCommentFactory.makePrismaQuestionComment({
      authorId: user.id,
      questionId: question.id,
    });

    const response = await request(app.getHttpServer())
      .delete(`/comments/${comment.id.toString()}/questions`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(204);

    const commentOnDatabase = await prisma.comment.findUnique({
      where: {
        id: comment.id.toString(),
      },
    });

    expect(commentOnDatabase).toBeNull();
  });
});
