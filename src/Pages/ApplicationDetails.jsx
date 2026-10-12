
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { jobSeekerApi } from "../services/api";
import "../CSS/ApplicationDetails.css";

const formatDate = (value) => {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatStatus = (status) => {
  if (!status) return "Unknown";

  return status
    .toString()
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const getStatusClass = (status) => {
  const normalized = (status || "").toString().toLowerCase();

  if (
    normalized.includes("accept") ||
    normalized.includes("selected") ||
    normalized.includes("offer") ||
    normalized.includes("hired")
  ) {
    return "success";
  }

  if (
    normalized.includes("reject") ||
    normalized.includes("declined") ||
    normalized.includes("withdrawn")
  ) {
    return "danger";
  }

  if (
    normalized.includes("interview") ||
    normalized.includes("shortlist")
  ) {
    return "info";
  }

  if (
    normalized.includes("review") ||
    normalized.includes("pending") ||
    normalized.includes("submitted")
  ) {
    return "warning";
  }

  return "neutral";
};

const getErrorMessage = (error) => {
  const status = error.response?.status;

  if (status === 401) {
    return "Your session could not be authenticated. Please sign in again.";
  }

  if (status === 403) {
    return "You do not have permission to view this application.";
  }

  if (status === 404) {
    return "This application could not be found. It may have been removed.";
  }

  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    "Unable to load application details. Please try again."
  );
};

function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadApplication = async () => {
      if (!id) {
        setError("Application ID is missing.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      setApplication(null);

      try {
        // Use the actual ID from /applications/:id.
        // Do not strip prefixes or substitute a fake ID.
        const response = await jobSeekerApi.getApplicationById(id);

        // Supports APIs that return either an application object
        // directly or an object containing an application property.
        const data = response?.data;
        const result = data?.application ?? data;

        if (!result || typeof result !== "object") {
          throw new Error("Application details were not returned by the server.");
        }

        if (!cancelled) {
          setApplication(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadApplication();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleRetry = () => {
    // Re-run the request by reloading this page.
    window.location.reload();
  };

  if (loading) {
    return (
      <main className="application-details-page">
        <div className="application-details-container">
          <Link to="/applications" className="application-back-link">
            ← Back to My Applications
          </Link>

          <section className="application-state-card" aria-live="polite">
            <div className="application-spinner" aria-hidden="true" />
            <h2>Loading application details</h2>
            <p>Please wait while we retrieve your application.</p>
          </section>
        </div>
      </main>
    );
  }

  if (error || !application) {
    return (
      <main className="application-details-page">
        <div className="application-details-container">
          <Link to="/applications" className="application-back-link">
            ← Back to My Applications
          </Link>

          <section className="application-state-card application-error-card">
            <div className="application-state-icon" aria-hidden="true">
              !
            </div>
            <h2>Unable to load application</h2>
            <p role="alert">
              {error || "Application details are unavailable."}
            </p>

            <div className="application-state-actions">
              <button
                type="button"
                className="application-button application-button-primary"
                onClick={handleRetry}
              >
                Try Again
              </button>

              <button
                type="button"
                className="application-button application-button-secondary"
                onClick={() => navigate("/applications")}
              >
                My Applications
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  // Accommodate common backend field names without inventing values.
  const jobTitle =
    application.jobTitle ||
    application.job?.title ||
    application.job?.jobTitle ||
    "Job title unavailable";

  const companyName =
    application.companyName ||
    application.company?.name ||
    application.job?.companyName ||
    application.job?.company?.name ||
    "Company unavailable";

  const location =
    application.jobLocation ||
    application.location ||
    application.job?.location ||
    application.job?.jobLocation ||
    "Location not specified";

  const status = application.status || application.applicationStatus;

  const applicationId =
    application.id ??
    application.applicationId ??
    id;

  const appliedAt =
    application.appliedAt ||
    application.applicationDate ||
    application.createdAt ||
    application.createdOn;

  const updatedAt =
    application.updatedAt ||
    application.lastUpdatedAt ||
    application.modifiedAt;

  const eligibilityScore =
    application.eligibilityScore ??
    application.matchScore ??
    application.score;

  const description =
    application.jobDescription ||
    application.job?.description ||
    application.description;

  const employmentType =
    application.employmentType ||
    application.job?.employmentType ||
    application.jobType;

  const experience =
    application.experienceRequired ||
    application.job?.experienceRequired;

  const salary =
    application.salaryRange ||
    application.job?.salaryRange ||
    application.job?.salary;

  const recruiterName =
    application.recruiterName ||
    application.job?.recruiterName;

  const notes =
    application.feedback ||
    application.recruiterFeedback ||
    application.notes;

  const statusClass = getStatusClass(status);

  return (
    <main className="application-details-page">
      <div className="application-details-container">
        <nav className="application-breadcrumb" aria-label="Breadcrumb">
          <Link to="/applications" className="application-back-link">
            ← My Applications
          </Link>
          <span className="application-breadcrumb-separator">/</span>
          <span>Application Details</span>
        </nav>

        <header className="application-details-header">
          <div className="application-heading-content">
            <div className="application-company-avatar" aria-hidden="true">
              {companyName.charAt(0).toUpperCase()}
            </div>

            <div className="application-heading-text">
              <p className="application-eyebrow">APPLICATION DETAILS</p>
              <h1>{jobTitle}</h1>
              <p className="application-company-name">{companyName}</p>
              <p className="application-location">
                <span aria-hidden="true">⌖</span> {location}
              </p>
            </div>
          </div>

          <span
            className={`application-status-badge application-status-${statusClass}`}
          >
            <span className="application-status-dot" aria-hidden="true" />
            {formatStatus(status)}
          </span>
        </header>

        <div className="application-details-grid">
          <div className="application-main-column">
            <section className="application-panel">
              <div className="application-panel-heading">
                <div>
                  <p className="application-eyebrow">OVERVIEW</p>
                  <h2>Application Summary</h2>
                </div>
                <span className="application-panel-icon" aria-hidden="true">
                  ▤
                </span>
              </div>

              <div className="application-summary-grid">
                <div className="application-summary-item">
                  <span className="application-field-label">
                    Application ID
                  </span>
                  <strong className="application-id-value">
                    {applicationId}
                  </strong>
                </div>

                <div className="application-summary-item">
                  <span className="application-field-label">
                    Date Applied
                  </span>
                  <strong>{formatDate(appliedAt)}</strong>
                </div>

                <div className="application-summary-item">
                  <span className="application-field-label">
                    Current Status
                  </span>
                  <strong>{formatStatus(status)}</strong>
                </div>

                <div className="application-summary-item">
                  <span className="application-field-label">
                    Last Updated
                  </span>
                  <strong>{formatDate(updatedAt)}</strong>
                </div>
              </div>
            </section>

            {eligibilityScore !== undefined &&
              eligibilityScore !== null && (
                <section className="application-panel">
                  <div className="application-panel-heading">
                    <div>
                      <p className="application-eyebrow">YOUR MATCH</p>
                      <h2>Eligibility Score</h2>
                    </div>
                    <span
                      className="application-panel-icon"
                      aria-hidden="true"
                    >
                      ◈
                    </span>
                  </div>

                  <div className="application-score-row">
                    <div>
                      <strong className="application-score-value">
                        {eligibilityScore}
                        {typeof eligibilityScore === "number" ? "%" : ""}
                      </strong>
                      <p className="application-muted-text">
                        Match score provided by SmartHire
                      </p>
                    </div>
                  </div>

                  {typeof eligibilityScore === "number" && (
                    <div
                      className="application-score-track"
                      role="progressbar"
                      aria-label="Eligibility score"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.min(
                        100,
                        Math.max(0, eligibilityScore)
                      )}
                    >
                      <div
                        className="application-score-fill"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(0, eligibilityScore)
                          )}%`,
                        }}
                      />
                    </div>
                  )}
                </section>
              )}

            {description && (
              <section className="application-panel">
                <div className="application-panel-heading">
                  <div>
                    <p className="application-eyebrow">THE OPPORTUNITY</p>
                    <h2>Job Description</h2>
                  </div>
                </div>

                <p className="application-description">{description}</p>
              </section>
            )}

            <section className="application-panel">
              <div className="application-panel-heading">
                <div>
                  <p className="application-eyebrow">PROGRESS</p>
                  <h2>Application Status</h2>
                </div>
              </div>

              <div className="application-status-detail">
                <span
                  className={`application-status-indicator application-indicator-${statusClass}`}
                  aria-hidden="true"
                />

                <div>
                  <h3>{formatStatus(status)}</h3>
                  <p>
                    {status
                      ? `Your application is currently marked as ${formatStatus(
                          status
                        )}.`
                      : "The latest application status has not been provided."}
                  </p>
                </div>
              </div>

              <p className="application-status-disclaimer">
                Your application status will update when the recruiting team
                records a new decision or progress update.
              </p>
            </section>

            {notes && (
              <section className="application-panel">
                <div className="application-panel-heading">
                  <div>
                    <p className="application-eyebrow">FEEDBACK</p>
                    <h2>Recruiter Notes</h2>
                  </div>
                </div>

                <p className="application-description">{notes}</p>
              </section>
            )}
          </div>

          <aside className="application-sidebar">
            <section className="application-panel">
              <div className="application-panel-heading">
                <div>
                  <p className="application-eyebrow">POSITION</p>
                  <h2>Job Information</h2>
                </div>
              </div>

              <div className="application-info-list">
                <div className="application-info-item">
                  <span className="application-field-label">Job Title</span>
                  <strong>{jobTitle}</strong>
                </div>

                <div className="application-info-item">
                  <span className="application-field-label">Company</span>
                  <strong>{companyName}</strong>
                </div>

                <div className="application-info-item">
                  <span className="application-field-label">Location</span>
                  <strong>{location}</strong>
                </div>

                {employmentType && (
                  <div className="application-info-item">
                    <span className="application-field-label">
                      Employment Type
                    </span>
                    <strong>{employmentType}</strong>
                  </div>
                )}

                {experience && (
                  <div className="application-info-item">
                    <span className="application-field-label">
                      Experience
                    </span>
                    <strong>{experience}</strong>
                  </div>
                )}

                {salary && (
                  <div className="application-info-item">
                    <span className="application-field-label">Salary</span>
                    <strong>{salary}</strong>
                  </div>
                )}

                {recruiterName && (
                  <div className="application-info-item">
                    <span className="application-field-label">Recruiter</span>
                    <strong>{recruiterName}</strong>
                  </div>
                )}
              </div>
            </section>

            <section className="application-help-card">
              <div className="application-help-icon" aria-hidden="true">
                ?
              </div>
              <h3>Need help?</h3>
              <p>
                Keep checking your applications for updates from the recruiting
                team.
              </p>
              <button
                type="button"
                className="application-button application-button-secondary application-full-width"
                onClick={() => navigate("/applications")}
              >
                View All Applications
              </button>
            </section>
          </aside>
        </div>

        <footer className="application-details-footer">
          <button
            type="button"
            className="application-button application-button-secondary"
            onClick={() => navigate("/applications")}
          >
            ← Back to My Applications
          </button>
        </footer>
      </div>
    </main>
  );
}

export default ApplicationDetails;
