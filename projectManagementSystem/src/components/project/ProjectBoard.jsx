import Board from "../board/Board";

export default function ProjectBoard({ projectId }) {
  return (
    <div className="h-[calc(100vh-280px)] min-h-[500px]">
      <Board projectId={projectId} />
    </div>
  );
}
