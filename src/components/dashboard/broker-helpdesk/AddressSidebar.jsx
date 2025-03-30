import { motion } from "framer-motion";
import Social from "../../common/footer/Social";

const AddressSidebar = () => {
  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center gap-4">
        {/** CARD DATA */}
        {[
          {
            title: "Office",
            icon: "flaticon-house-2",
            content: "XYZ street, Model Town, British Columbia, Canada",
          },
          {
            title: "Hours",
            icon: "flaticon-house-1",
            content: "Monday - Friday: 8 AM - 5 PM ET",
          },
          {
            title: "Contact",
            icon: "flaticon-telephone",
            content: "+1 302-000-1111",
          },
          {
            title: "Chat",
            icon: "flaticon-envelope",
            content: "Chat with us online!",
          },
        ].map((card, index) => (
          <motion.div
            key={index}
            className="col-lg-3 card-box"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.1 }}
          >
            <h3 className="text-center">{card.title}</h3>
            <div className="d-flex align-items-center justify-content-center">
              <span className={`btn text-color fs-4 ${card.icon}`}></span>
            </div>
            <p className="text-center">{card.content}</p>
            {card.title === "Chat" && (
              <div className="text-center">
                <h5>Follow Us!</h5>
                <Social />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AddressSidebar;
