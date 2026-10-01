import { useState } from "react";
import { ResourcePage } from "../../components/resource/ResourcePage.jsx";
import { ROLES } from "../../constants/app.js";
import { DocumentViewer } from "./DocumentViewer.jsx";
import { PayslipDocument, payslipMonthTitle } from "./PayslipDocument.jsx";
import { safeFileName } from "./pdf.js";
import { payslipConfig } from "./payslip.config.js";

// Admin: "Payslip Generate" (form with live calculation + list with View / Download).
// Employees and managers: their own payslips, each with a Download Payslip button.
export function PayslipPage({ user }) {
  const [viewing, setViewing] = useState(null);
  const isAdmin = user.role === ROLES.ADMIN;

  if (viewing) {
    const month = payslipMonthTitle(viewing.date);
    return (
      <DocumentViewer
        title="Payslip"
        backLabel="Back to Payslips"
        onBack={() => setViewing(null)}
        filename={`Payslip_${safeFileName(viewing.employeeName)}_${safeFileName(month)}.pdf`}
        autoDownload={!isAdmin}
        render={(ref) => <PayslipDocument ref={ref} payslip={viewing} />}
      />
    );
  }

  return (
    <ResourcePage
      config={payslipConfig}
      user={user}
      onView={setViewing}
      viewLabel={isAdmin ? "View / Download" : "Download Payslip"}
      viewIcon={isAdmin ? "bi-eye" : "bi-download"}
    />
  );
}
