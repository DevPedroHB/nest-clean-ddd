import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { QuestionFactory } from "test/factories/make-question";
import { QuestionCommentFactory } from "test/factories/make-question-comment";
import { UserFactory } from "test/factories/make-user";

describe("Fetch question comments (E2E)", () => {
  let app: INestApplication;
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

    userFactory = moduleRef.get(UserFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    questionCommentFactory = moduleRef.get(QuestionCommentFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[GET] /comments/:questionId/questions", async () => {
    const user = await userFactory.makePrismaUser();
    const accessToken = jwt.sign({
      sub: user.id.toString(),
    });
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    await Promise.all([
      questionCommentFactory.makePrismaQuestionComment({
        content: "An example content 01",
        authorId: user.id,
        questionId: question.id,
      }),
      questionCommentFactory.makePrismaQuestionComment({
        content: "An example content 02",
        authorId: user.id,
        questionId: question.id,
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get(`/comments/${question.id.toString()}/questions`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      comments: expect.arrayContaining([
        expect.objectContaining({
          content: "An example content 01",
          authorName: user.name,
        }),
        expect.objectContaining({
          content: "An example content 02",
          authorName: user.name,
        }),
      ]),
    });
  });
});
