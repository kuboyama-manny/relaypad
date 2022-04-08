import { schema } from "normalizr";

export const post = new schema.Entity("posts", {}, { idAttribute: "slug" });
export const comment = new schema.Entity("comments");
export const tag = new schema.Entity("tags", {}, { idAttribute: "slug" });
export const member = new schema.Entity(
  "members",
  {},
  { idAttribute: "username" }
);
export const team = new schema.Entity("teams", {}, { idAttribute: "slug" });

export const arrayOfPosts = [post];
export const arrayOfMembers = [member];
export const arrayOfComments = [comment];
export const arrayOfTags = [tag];
export const arrayOfTeams = [tag];

post.define({
  member,
  tags: arrayOfTags
});

comment.define({
  member
});

member.define({
  team
});
