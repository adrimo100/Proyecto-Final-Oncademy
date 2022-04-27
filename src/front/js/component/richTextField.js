import "../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useField } from "formik";
import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import {
  EditorState,
  convertToRaw,
  convertFromHTML,
  ContentState,
} from "draft-js";
import draftjsToHtml from "draftjs-to-html";

export const RichTextField = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props.name);

  // We have two different states:
  // 1. The editor state: is a complex object with metadata like the
  //    current selection, the current block, etc.
  // 2. The formik value: is a string that contains the editor contents as HTML.
  //    The value store in the DB.
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const formikValue = meta.value;

  // Convert formik value to an editor state.
  // This is triggered when we change the subject.
  useEffect(() => {
    const blocksFromHTML = convertFromHTML(formikValue);
    const state = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );

    setEditorState(EditorState.createWithContent(state));
  }, [formikValue]);

  // Formik value is only updated when we leave the editor.
  function saveStateToFormik() {
    const htmlString = draftjsToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    helpers.setValue(htmlString);
  }

  const notValid = meta.touched && meta.error;

  return (
    <div>
      <label className="form-label">{label}</label>
      <Editor
        editorState={editorState}
        onEditorStateChange={(editorState) => setEditorState(editorState)}
        wrapperClassName="w-auto"
        editorClassName="form-control"
        onBlur={saveStateToFormik}
      />
      {notValid && <div className="form-text text-danger">{meta.error}</div>}
    </div>
  );
};
