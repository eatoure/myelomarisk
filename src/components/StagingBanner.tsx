import { Link } from "react-router-dom";
import { FlaskConical } from "lucide-react";
import { isPreviewBuild, stagedChanges } from "@/lib/preview";

/**
 * Sits above the header on staging builds so reviewers always know they are
 * not on the live site, and can get to the list of what needs approval.
 */
const StagingBanner = () => {
  if (!isPreviewBuild) return null;

  const count = stagedChanges.length;

  return (
    <div className="bg-amber-500 text-amber-950">
      <div className="container mx-auto px-4 py-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm">
        <span className="inline-flex items-center gap-2 font-semibold">
          <FlaskConical className="h-4 w-4" />
          Staging preview — not the live site
        </span>
        <Link to="/preview" className="underline underline-offset-2 hover:no-underline">
          {count} {count === 1 ? "change" : "changes"} awaiting approval
        </Link>
      </div>
    </div>
  );
};

export default StagingBanner;
