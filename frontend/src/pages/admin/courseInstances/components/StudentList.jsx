const StudentList = ({ students }) => {

  console.log("students:", students);
  return (
    <div className="bg-white border rounded-xl p-5">
      <h3 className="font-semibold mb-4">
        Enrolled Students ({students.length})
      </h3>

      {students.length === 0 ? (
        <p className="text-sm text-gray-500">
          No students enrolled
        </p>
      ) : (
        <ul className="space-y-2 text-sm">
          {students.map((student) => (
            <li
              key={student._id}
              className="flex justify-between border-b pb-1"
            >
              <span>{student.name}</span>
              <span className="text-gray-500">
                {student.studentProfile?.section}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentList;
/*import { useState } from "react";

const PAGE_SIZE = 10; // students per page

const StudentList = ({ students = [] }) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(students.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const paginatedStudents = students.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="bg-white border rounded-xl p-5">
      <h3 className="font-semibold mb-4">
        Enrolled Students ({students.length})
      </h3>

      {students.length === 0 ? (
        <p className="text-sm text-gray-500">No students enrolled</p>
      ) : (
        <>
          <ul className="space-y-2 text-sm">
            {paginatedStudents.map((student) => (
              <li
                key={student._id}
                className="flex justify-between border-b pb-1"
              >
                <span>{student.name}</span>
                <span className="text-gray-500">
                  {student.studentProfile?.section}
                </span>
              </li>
            ))}
          </ul> */

          {/* Pagination Controls 
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 text-sm">
              <button
                disabled={!canPrev}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-gray-500">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={!canNext}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentList;*/}

