import { useState } from "react";
import { coursesAPI } from "../api/courses";

export function useEnroll() {
  const [enrollingId, setEnrollingId] = useState<number | null>(null);

  /**
   * Enroll user in a course (econometric or learning)
   * Returns true if successful
   */
  const enroll = async (courseId: number, type: "econometric" | "learning") => {
    try {
      setEnrollingId(courseId);
      const response = await coursesAPI.enrollInCourse(courseId, type);
      return !!response;
    } catch (error) {
      console.error("Enrollment failed:", error);
      alert("An error occurred while enrolling. Please try again.");
      return false;
    } finally {
      setEnrollingId(null);
    }
  };

  return { enroll, enrollingId };
}
