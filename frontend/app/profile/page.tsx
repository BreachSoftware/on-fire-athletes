import ProfileClient from "@/app/profile/components/profile.client";
export { generateMetadata } from "@/app/profile/page-metadata";

// Add this line to mark the route as dynamic
export const dynamic = "force-dynamic";

export default function ProfilePage() {
    return <ProfileClient />;
}
