import { supabase } from "../supabase.js"; // Adjust path as needed

document.addEventListener("DOMContentLoaded", async () => {
  const notificationIcon = document.getElementById("notificationIcon");
  const notificationModal = document.getElementById("notificationModal");
  const closeModal = document.getElementById("closeModal");
  const notificationList = document.getElementById("notificationList");
  const notificationBadge = document.getElementById("notificationBadge");

  // Close modal on click
  closeModal.addEventListener("click", () => {
    notificationModal.style.display = "none";
  });

  // Close modal if clicked outside content
  window.addEventListener("click", (e) => {
    if (e.target === notificationModal) {
      notificationModal.style.display = "none";
    }
  });

  // Fetch and update notification count on load
  await updateNotificationCount();

  // Open modal and load notifications on icon click
  notificationIcon.addEventListener("click", async () => {
    notificationModal.style.display = "flex";
    await loadNotifications();
  });

  async function getCustomerId() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) {
      console.error("User not authenticated");
      return null;
    }

    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (customerError || !customer) {
      console.error("Customer not found");
      return null;
    }

    return customer.id;
  }

  async function updateNotificationCount() {
    const customerId = await getCustomerId();
    if (!customerId) return;

    const { count, error } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("customer_id", customerId)
      .is("read_at", null); // Unread only

    if (error) {
      console.error("Error fetching notification count:", error);
      return;
    }

    notificationBadge.textContent = count;
    notificationBadge.style.display = count > 0 ? "block" : "none";
  }

  async function loadNotifications() {
    document.getElementsByClassName("spinner-border").style.display = "none";
    const customerId = await getCustomerId();
    console.log("this is customerId", customerId);
    if (!customerId) return;

    const { data: notifications, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching notifications:", error);
      return;
    }

    notificationList.innerHTML = ""; // Clear list

    console.log("all the notifications", notifications);
    notifications.forEach((notif) => {
      const words = notif.message.split(" ");
      const isLong = words.length > 11;
      const truncated = isLong
        ? words.slice(0, 11).join(" ") + "..."
        : notif.message;
      const isUnread = !notif.read_at;

      const notifDiv = document.createElement("div");
      notifDiv.style.padding = "10px";
      notifDiv.style.borderBottom = "1px solid #333";
      notifDiv.style.cursor = isLong ? "pointer" : "default";
      notifDiv.style.fontWeight = isUnread ? "bold" : "normal";

      const messageSpan = document.createElement("span");
      messageSpan.textContent = truncated;

      //   const closeX = document.createElement('span');
      //   closeX.textContent = '❌';
      //   closeX.style.float = 'right';
      //   closeX.style.cursor = 'pointer';
      //   closeX.addEventListener('click', async () => {
      //     if (!notif.read_at) {
      //       await markAsRead(notif.id);
      //     }
      //     // notifDiv.remove(); // Optional: Remove from list after marking read
      //   });

      notifDiv.appendChild(messageSpan);
      notifDiv.appendChild(closeX);

      if (isLong) {
        notifDiv.addEventListener("click", async () => {
          messageSpan.textContent = notif.message; // Show full
          notifDiv.style.cursor = "default"; // No more clickable
          if (isUnread) {
            await markAsRead(notif.id);
            notifDiv.style.fontWeight = "normal";
          }
        });
      }

      notificationList.appendChild(notifDiv);
    });

    // Update count after loading (in case some are marked read)
    await updateNotificationCount();
  }

  async function markAsRead(notificationId) {
    const { error } = await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", notificationId);

    if (error) {
      console.error("Error marking notification as read:", error);
    } else {
      await updateNotificationCount(); // Refresh count
    }
  }
});
