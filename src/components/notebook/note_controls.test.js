import React from "react";
import { shallow } from "enzyme";

import { findByTestAttr } from "../../../test/testUtils";
import NoteControls from "./note_controls";

const defaultActiveNote = {
  status: "DRAFT",
  member: {
    username: "note-author"
  }
};

const defaultCurrentMember = {
  username: "note-author"
};

const setup = (initialState = {}) => {
  const wrapper = shallow(
    <NoteControls
      {...initialState}
      changeMobileView={() => {}}
      handlePublishClick={() => {}}
      toggleBookmark={() => {}}
    />
  );
  return wrapper;
};

describe("note controls", () => {
  describe("user views note they created", () => {
    let wrapper;
    beforeEach(() => {
      wrapper = setup({
        activeNote: defaultActiveNote,
        currentMember: defaultCurrentMember,
        isNoteEditable: true
      });
    });
    test("renders component without error", () => {
      const component = findByTestAttr(wrapper, "component-note-controls");
      expect(component.length).toBe(1);
    });
    test("renders delete button ", () => {
      const deleteButton = findByTestAttr(wrapper, "delete-button");
      expect(deleteButton.length).toBe(1);
    });

    describe("note is private", () => {
      beforeEach(() => {});
      test("does not show comment count", () => {
        const commentCount = findByTestAttr(wrapper, "comment-count");
        expect(commentCount.length).toBe(0);
      });
      test("does not show reaction count", () => {
        const reactionCount = findByTestAttr(wrapper, "reaction-count");
        expect(reactionCount.length).toBe(0);
      });
    });

    describe("note is published", () => {
      beforeEach(() => {
        wrapper = setup({
          activeNote: { ...defaultActiveNote, status: "PUBLISHED" },
          currentMember: defaultCurrentMember,
          isNoteEditable: true
        });
      });
      test("shows comment count", () => {
        const commentCount = findByTestAttr(wrapper, "comment-count");
        expect(commentCount.length).toBe(1);
      });
      test("shows reaction count", () => {
        const reactionCount = findByTestAttr(wrapper, "reaction-count");
        expect(reactionCount.length).toBe(1);
      });
    });
  });

  describe("user views note they did not create", () => {
    let wrapper;
    beforeEach(() => {
      wrapper = setup({
        activeNote: { ...defaultActiveNote, status: "PUBLISHED" },
        currentMember: { ...defaultCurrentMember, username: "note-reader" },
        isNoteEditable: false
      });
    });

    test("renders component without error", () => {
      const component = findByTestAttr(wrapper, "component-note-controls");
      expect(component.length).toBe(1);
    });
    test("does not render delete button ", () => {
      const deleteButton = findByTestAttr(wrapper, "delete-button");
      expect(deleteButton.length).toBe(0);
    });
    test("shows comment count", () => {
      const commentCount = findByTestAttr(wrapper, "comment-count");
      expect(commentCount.length).toBe(1);
    });
    test("shows reaction count", () => {
      const reactionCount = findByTestAttr(wrapper, "reaction-count");
      expect(reactionCount.length).toBe(1);
    });
  });
});
