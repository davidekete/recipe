import Elysia from "elysia";
import {
  createComment,
  getAllCommentsForRecipe,
} from "../services/comments.service";
import { verifyToken } from "../services/auth.service";

export const commentController = (app: Elysia) => {
  app.post("/:recipeId/create-comment", async (context) => {
    try {
      const authHeader = context.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];
      const recipeId = context.params.recipeId;

      if (!token) {
        throw new Error("Invalid token");
      }

      const verifiedToken = verifyToken(token as string);

      const commentData: any = context.body;

      const newComment = await createComment({
        body: commentData.body,
        recipeId: +recipeId,
        userId: verifiedToken?.id,
      });
    } catch (error: any) {
      return {
        message: "Comment creation failed",
        error: error.message,
      };
    }
  });

  app.get("/:recipeId/comments", async (context) => {
    try {
      const recipeId = context.params.recipeId;

      const comments = await getAllCommentsForRecipe(+recipeId);

      return {
        message: "Comments retrieved successfully",
        comments,
      };
    } catch (error: any) {
      return {
        message: "Comments retrieval failed",
        error: error.message,
      };
    }
  });
};
