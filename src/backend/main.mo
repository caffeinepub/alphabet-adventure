import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type ProgressEntry = {
    activityName : Text;
    starsEarned : Nat;
    levelReached : Nat;
  };

  public type UserProfile = {
    name : Text;
  };

  let progressEntries = Map.empty<Principal, List.List<ProgressEntry>>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Initialize the access control state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Add a progress entry for the current user
  public shared ({ caller }) func addProgress(activityName : Text, starsEarned : Nat, levelReached : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add progress");
    };

    let entry : ProgressEntry = {
      activityName;
      starsEarned;
      levelReached;
    };

    let currentEntries = switch (progressEntries.get(caller)) {
      case (null) { List.empty<ProgressEntry>() };
      case (?entries) { entries };
    };

    currentEntries.add(entry);
    progressEntries.add(caller, currentEntries);
  };

  // Get all progress entries for the current user
  public query ({ caller }) func getProgress() : async [ProgressEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view progress");
    };

    switch (progressEntries.get(caller)) {
      case (null) { [] };
      case (?entries) {
        entries.values().toArray();
      };
    };
  };

  // Get the total number of stars earned by the current user
  public query ({ caller }) func getTotalStars() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view total stars");
    };

    switch (progressEntries.get(caller)) {
      case (null) { 0 };
      case (?entries) {
        entries.values().toArray().foldLeft(
          0,
          func(acc : Nat, entry : ProgressEntry) : Nat { acc + entry.starsEarned },
        );
      };
    };
  };

  // Helper function to calculate total stars (internal use)
  private func calculateTotalStars(caller : Principal) : Nat {
    switch (progressEntries.get(caller)) {
      case (null) { 0 };
      case (?entries) {
        entries.values().toArray().foldLeft(
          0,
          func(acc : Nat, entry : ProgressEntry) : Nat { acc + entry.starsEarned },
        );
      };
    };
  };

  // Get the list of badges earned by the current user based on star milestones
  public query ({ caller }) func getBadges() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view badges");
    };

    let totalStars = calculateTotalStars(caller);
    let badges = List.empty<Text>();

    if (totalStars >= 5) { badges.add("Star Starter") };
    if (totalStars >= 15) { badges.add("Word Wizard") };
    if (totalStars >= 30) { badges.add("Sentence Star") };
    if (totalStars >= 50) { badges.add("Alphabet Champion") };

    badges.toArray();
  };

  // Reset the progress for the current user
  public shared ({ caller }) func resetProgress() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can reset progress");
    };

    progressEntries.remove(caller);
  };
};
