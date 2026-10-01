import { useState } from "react";
import { ResourcePage } from "../../components/resource/ResourcePage.jsx";
import { DocumentViewer } from "../payslip/DocumentViewer.jsx";
import { safeFileName } from "../payslip/pdf.js";
import { CompensationDocument } from "./CompensationDocument.jsx";
import { compensationConfig } from "./compensation.config.js";

// Salary structure and bank details ("Compensation Details" for admin, "Bank Details" for employees),
// with a View button that shows the monthly structure in the payslip layout.
export function CompensationPage({ user }) {
  const [viewing, setViewing] = useState(null);

  if (viewing) {
    return (
      <DocumentViewer
        title="Compensation Structure"
        backLabel="Back"
        onBack={() => setViewing(null)}
        filename={`Compensation_${safeFileName(viewing.employeeName)}.pdf`}
        render={(ref) => <CompensationDocument ref={ref} compensation={viewing} />}
      />
    );
  }

  return <ResourcePage config={compensationConfig} user={user} onView={setViewing} viewLabel="View" viewIcon="bi-eye" />;
}
