import MembersList from "../members/MembersList";

export default function ProjectMembers({ projectId }) {
  return (
    <div className="animate-in fade-in duration-300">
      <MembersList projectId={projectId} />
    </div>
  );
}
