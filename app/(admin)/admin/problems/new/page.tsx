import ProblemForm from "../ProblemForm";

export default function NewProblemPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Create New Problem
        </h1>
        <p className="text-slate-400">Add a new problem with test cases</p>
      </div>

      <ProblemForm />
    </div>
  );
}
