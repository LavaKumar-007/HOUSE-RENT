import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile, changePassword } from "../api/authApi";
import PageMeta from "../components/PageMeta";
import ProtectedRoute from "../components/ProtectedRoute";

function ProfileContent() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({ fullName: user?.fullName || "", phone: user?.phone || "", profileImage: user?.profileImage || "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const data = await updateProfile(profile);
      updateUser(data.user);
      setMsg("Profile updated");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    try {
      await changePassword(passwords);
      setMsg("Password changed");
      setPasswords({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Password change failed");
    }
  };

  return (
    <div className="page-section">
      <PageMeta title="Profile" />
      <div className="container-xl form-container">
        <p className="section-label">Account</p>
        <h1 className="display-title" style={{ fontSize: "2.5rem", marginBottom: 24 }}>Profile Settings</h1>
        {msg && <div className="alert-custom alert-success">{msg}</div>}
        {error && <div className="alert-custom alert-error">{error}</div>}
        <form className="property-form glass-card mb-4" onSubmit={saveProfile}>
          <h3 style={{ marginBottom: 16 }}>Personal Info</h3>
          <input className="form-control-custom mb-3" value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} placeholder="Full name" />
          <input className="form-control-custom mb-3" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="Phone" />
          <input className="form-control-custom mb-3" value={profile.profileImage} onChange={(e) => setProfile({ ...profile, profileImage: e.target.value })} placeholder="Profile image URL" />
          <p style={{ color: "var(--text-muted)", marginBottom: 16 }}>Email: {user?.email} · Role: {user?.role}</p>
          <button className="btn-primary-custom">Save Profile</button>
        </form>
        <form className="property-form glass-card" onSubmit={savePassword}>
          <h3 style={{ marginBottom: 16 }}>Change Password</h3>
          <input className="form-control-custom mb-3" type="password" placeholder="Current password" required value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} />
          <input className="form-control-custom mb-3" type="password" placeholder="New password" required minLength={6} value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} />
          <button className="btn-primary-custom">Update Password</button>
        </form>
      </div>
    </div>
  );
}

function Profile() {
  return <ProtectedRoute><ProfileContent /></ProtectedRoute>;
}

export default Profile;
