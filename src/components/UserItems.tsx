import React, { useEffect, useState } from "react";
import Portal from "@arcgis/core/portal/Portal";
import PortalItem from "@arcgis/core/portal/PortalItem";

interface UserItem {
  id: string;
  title: string;
  type: string;
  thumbnailUrl: string;
  tags: string[];
}

const UserItems: React.FC<{ user: { username: string } | null }> = ({
  user,
}) => {
  const [items, setItems] = useState<UserItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserItems = async () => {
      if (!user) return;

      try {
        const portal = new Portal();
        portal.authMode = "immediate";
        await portal.load();

        const queryParams = {
          query: `owner:${user.username}`,
          start: 1,
          num: 50,
          sortField: "title" as "title",
        };
        const { results } = await portal.queryItems(queryParams);
        setItems(
          results.map((item) => ({
            id: item.id,
            title: item.title,
            type: item.type,
            thumbnailUrl: item.thumbnailUrl,
            tags: item.tags || [],
          })) || []
        );
      } catch (err) {
        console.error("Error fetching user items:", err);
        setError("Failed to fetch user items.");
      }
    };

    fetchUserItems();
  }, [user]);

  const updateTags = async (itemId: string, newTags: string[]) => {
    try {
      const portalItem = new PortalItem({ id: itemId });
      await portalItem.load();
      portalItem.tags = newTags;
      await portalItem.update();

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, tags: newTags } : item
        )
      );
    } catch (err) {
      console.error("Error updating tags:", err);
      setError("Failed to update tags.");
    }
  };

  if (!user) return <p>Please sign in to view your items.</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <div className="row">
          {items.map((item) => (
            <div className="col-md-4 mb-4" key={item.id}>
              <div className="card h-100">
                {item.thumbnailUrl && (
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="card-img-top"
                  />
                )}
                <div className="cardStyle card-body">
                  <h5 className="itemText card-title">{item.title}</h5>
                  <p className="itemText card-text">
                    <strong>Tags:</strong> {item.tags.join(", ") || "No tags"}
                  </p>
                  <button
                    className="mainButtonStyle btn btn-primary"
                    onClick={() => {
                      const newTag = prompt("Enter a new tag:");
                      if (newTag) updateTags(item.id, [...item.tags, newTag]);
                    }}
                  >
                    Add Tag
                  </button>
                  <button
                    className="secondaryButtonStyle btn btn-secondary ms-2"
                    onClick={() => {
                      const updatedTags = prompt(
                        "Edit tags (comma-separated):",
                        item.tags.join(", ")
                      );
                      if (updatedTags)
                        updateTags(
                          item.id,
                          updatedTags.split(",").map((tag) => tag.trim())
                        );
                    }}
                  >
                    Edit Tags
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserItems;
