import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";

export const EditSubjectsModal = ({ user }) => {
  const {store, actions} = useContext(Context)
  
  const subjects = user?.subjects.map((subject) => ({
    id: subject.id,
    name: `${subject.name} (${subject.course_name})` 
  }))

  useEffect(() => {
    if (!store.courses.length) {
      actions.getCourses()
    }
  })
  
  return (
    <div id="edit-subjects" className="modal fade" tabIndex="-1">
      <div className="modal-dialog">
        {user && (
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Asignaturas de {user.full_name}</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <ul class="list-group">
                { subjects.map((subject) => (
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                  { subject.name }
                  <span class="badge bg-primary rounded-pill">Cursando</span>
                </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
