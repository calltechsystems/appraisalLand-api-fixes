import React, { Component, useState } from "react";
import { useRouter } from "next/router";
import { CldUploadWidget } from "next-cloudinary";
import ReactInputMask from "react-input-mask";
import CheckBoxFilter from "../../common/CheckBoxFilter";
import toast from "react-hot-toast";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const DetailedInfo = ({
  onCancelHandler,
  isDisable,
  updateHandler,
  remark,
  setRemark,
  applicantFirstName,
  setApplicantFirstName,
  applicantLatsName,
  setApplicantLastName,
  applicantNumber,
  setApplicantNumber,
  applicantEmail,
  setApplicantEmail,
  propertyData,
  submitHandler,
  changeStringUrlHandler,
  setApplicantAddress,
  applicantAddress,
  attachment,
  errorLabel,
  filesUrl,
  image,
  disable,
  setImage,
  haveSubscription,
  setFilesUrl,
  setAttachment,
  setDisable,
  handleInputChangeNew,
  setIsFormDirty,
}) => {
  const router = useRouter();
  const [isButtonDisabled, setButtonDisabled] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState([]);

  const cancelHandler = () => {
    router.push("/my-properties");
  };
  console.log(applicantEmail);

  const handleOpen = (event) => {
    const files = event.originalEvent.target.files;

    // Filter the selected images
    const images = Array.from(files).filter((file) =>
      ["image/jpeg", "image/png", "image/gif"].includes(file.type)
    );

    // Update the state with the selected images
    setSelectedImages(images);

    // Log the count of selected images
    console.log("Number of selected images:", images.length);
  };

  const getPreviewUrl = (file) => {
    if (file.type.startsWith("image/")) {
      return URL.createObjectURL(file);
    } else if (file.type === "application/pdf") {
      return "/assets/Attachments/pdfIcon.png";
    } else if (
      file.type === "application/zip" ||
      file.type === "application/x-zip-compressed"
    ) {
      return "/assets/Attachments/zipIcon.png";
    } else {
      return "/assets/Attachments/fileIcon.png";
    }
  };

  const downloadAllAttachments = async () => {
    const zip = new JSZip();

    for (const fileItem of attachment) {
      if (fileItem.uploadedUrl) {
        // Fetch file from uploaded URL (e.g., S3)
        const response = await fetch(fileItem.uploadedUrl);
        const blob = await response.blob();
        const fileName = fileItem.file?.name || "downloaded_file";
        zip.file(fileName, blob); // Add file directly to ZIP (no folder)
      } else if (fileItem.file) {
        // Add local files directly
        zip.file(fileItem.file.name, fileItem.file);
      }
    }

    // Generate the ZIP file and trigger download
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "attachments.zip"); // Download ZIP directly
    });
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const maxTotalSize = 25 * 1024 * 1024;

    const allowedFileTypes = [
      "application/zip",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "application/pdf",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "image/jpeg",
      "image/png",
      "image/gif",
      "text/plain",
      "text/csv",
      "audio/mpeg",
      "video/mp4",
    ];

    // If not a ZIP file, check directly

    if (
      file?.type !== "application/zip" &&
      file?.type !== "application/x-zip-compressed"
    ) {
      toast.error(
        `Only ZIP files are allowed, containing: .doc, .docx, .pdf, .xls, .xlsx, .ppt, .pptx, .jpg, .jpeg, .png, .gif, .mp3, .mp4, .zip, .txt, .csv.`
      );
      return;
    }

    const currentTotalSize = attachment.reduce(
      (total, item) => total + item.file.size,
      0
    );

    if (currentTotalSize + file.size > maxTotalSize) {
      toast.error("Upload failed! The attachment must be  ≤ 25 MB.");
      return;
    }

    const zip = new JSZip();
    try {
      const zipContents = await zip.loadAsync(file);
      const invalidFiles = [];

      // Loop through files in ZIP
      for (const fileName in zipContents.files) {
        const zipFile = zipContents.files[fileName];

        // Skip folders
        if (zipFile.dir) continue;

        // Get file extension
        const ext = fileName.split(".").pop().toLowerCase();
        const mimeType = getMimeType(ext);

        if (!allowedFileTypes.includes(mimeType)) {
          invalidFiles.push(fileName);
        }
      }

      if (invalidFiles.length > 0) {
        toast.error(`Invalid files in ZIP: ${invalidFiles.join(", ")}`);
        return;
      }

      setAttachment([
        ...attachment,
        {
          file,
          type: file.type,
          previewUrl: getPreviewUrl(file),
          uploadedUrl: "",
        },
      ]);
    } catch (error) {
      toast.error("Error processing ZIP file.");
      console.error("ZIP Processing Error:", error);
    }
  };

  // Utility function to get MIME type from file extension
  const getMimeType = (ext) => {
    const mimeTypes = {
      zip: "application/zip",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      pdf: "application/pdf",
      xls: "application/vnd.ms-excel",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ppt: "application/vnd.ms-powerpoint",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      txt: "text/plain",
      csv: "text/csv",
      mp3: "audio/mpeg",
      mp4: "video/mp4",
    };
    return mimeTypes[ext] || "unknown";
  };

  // Handle delete file
  const handleDelete = (index) => {
    const updatedAttachments = attachment.filter((_, i) => i !== index);
    setAttachment(updatedAttachments);
  };

  const errorLabelStyle = { borderColor: "red" };

  const checkIsError = (value) => {
    let isError = false;
    errorLabel.map((err, index) => {
      console.log(err, value);
      if (String(err) === String(value)) {
        isError = true;
      }
    });
    console.log(isError);
    return isError;
  };

  const [phoneNumber, setPhoneNumber] = useState("");

  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    // Allow only numeric input
    const numericValue = inputValue.replace(/\D/g, "");

    // Restrict to 10 digits
    const truncatedValue = numericValue.slice(0, 10);
    if (truncatedValue.length === 10) {
      setApplicantNumber(truncatedValue);
    }

    setApplicantNumber(truncatedValue);
    setIsFormDirty(true);
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="row" style={{ marginBottom: "10px" }}>
            <div className="col-lg-3 my_profile_setting_input form-group">
              <label
                className="text-color"
                style={{ paddingTop: "15px", fontWeight: "" }}
              >
                First Name <span class="req-btn">*</span>
              </label>
            </div>
            <div className="col-lg-5">
              <input
                style={
                  checkIsError("applicantFirstName")
                    ? errorLabelStyle
                    : {
                        backgroundColor: "#E8F0FE",
                        //color: "white",
                      }
                }
                type="text"
                className="form-control"
                id="formGroupExampleInput3"
                // onChange={(e) => setApplicantFirstName(e.target.value)}
                onChange={(e) => handleInputChangeNew(e, setApplicantFirstName)}
                value={applicantFirstName}
                disabled={isDisable}
                maxLength={30}
              />
            </div>
          </div>
          <div className="row" style={{ marginBottom: "10px" }}>
            <div className="col-lg-3 my_profile_setting_input form-group">
              <label
                className="text-color"
                style={{ paddingTop: "15px", fontWeight: "" }}
              >
                Last Name <span class="req-btn">*</span>
              </label>
            </div>
            <div className="col-lg-5">
              <input
                style={
                  checkIsError("applicantLastName")
                    ? errorLabelStyle
                    : {
                        // paddingTop: "15px",
                        // paddingBottom: "15px",
                        backgroundColor: "#E8F0FE",
                        //color: "white",
                      }
                }
                type="text"
                className="form-control"
                id="formGroupExampleInput3"
                // onChange={(e) => setApplicantLastName(e.target.value)}
                onChange={(e) => handleInputChangeNew(e, setApplicantLastName)}
                value={applicantLatsName}
                disabled={isDisable}
                maxLength={30}
              />
            </div>
          </div>
          <div className="row" style={{ marginBottom: "10px" }}>
            <div className="col-lg-3 my_profile_setting_input form-group">
              <label
                className="text-color"
                style={{ paddingTop: "15px", fontWeight: "" }}
              >
                Phone Number <span class="req-btn">*</span>
              </label>
              <div className="hover-text-01">
                <div
                  className="tooltip-text-01"
                  style={{
                    marginTop: "-60px",
                    marginLeft: "-100px",
                  }}
                >
                  <ul>
                    <li style={{ fontSize: "15px" }}>
                      Please enter phone number without country code.
                    </li>
                  </ul>
                </div>
                <i class="fa fa-info-circle" aria-hidden="true"></i>
              </div>
            </div>
            <div className="col-lg-5">
              <ReactInputMask
                mask="999 999-9999" // Canadian phone format
                value={applicantNumber}
                onChange={handleInputChange}
                className="form-control"
                disabled={isDisable}
                style={
                  checkIsError("applicantPhoneNumber")
                    ? errorLabelStyle
                    : {
                        backgroundColor: "#E8F0FE",
                      }
                }
              >
                {(inputProps) => (
                  <input
                    {...inputProps}
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    title="Please enter a valid phone number"
                    required
                  />
                )}
              </ReactInputMask>
            </div>
            {/* <div className="col-lg-5">
              <input
                style={
                  checkIsError("applicantPhoneNumber")
                    ? errorLabelStyle
                    : {
                        // paddingTop: "15px",
                        // paddingBottom: "15px",
                        backgroundColor: "#E8F0FE",
                        //color: "white",
                      }
                }
                type="text"
                id="phoneNumber"
                className="form-control"
                name="phoneNumber"
                value={applicantNumber}
                onChange={handleInputChange}
                pattern="[0-9]*"
                maxLength="10"
                title="Please enter only 10 digits"
                required
                disabled={isDisable}
              />
            </div> */}
          </div>
          <div className="row" style={{ marginBottom: "10px" }}>
            <div className="col-lg-3 my_profile_setting_input form-group">
              <label
                className="text-color"
                style={{ paddingTop: "15px", fontWeight: "" }}
              >
                Email Address <span class="req-btn">*</span>
              </label>
            </div>
            <div className="col-lg-5">
              <input
                style={
                  checkIsError("applicantEmailAddress")
                    ? errorLabelStyle
                    : {
                        // paddingTop: "15px",
                        // paddingBottom: "15px",
                        backgroundColor: "#E8F0FE",
                        //color: "white",
                      }
                }
                type="text"
                className="form-control"
                id="formGroupExampleInput3"
                // onChange={(e) => setApplicantEmail(e.target.value)}
                onChange={(e) => handleInputChangeNew(e, setApplicantEmail)}
                value={applicantEmail}
                disabled={isDisable}
                maxLength={100}
              />
            </div>
          </div>

          <div className="">
            <div className="row my_profile_setting_textarea">
              <div className="col-lg-3">
                <label
                  htmlFor="propertyDescription"
                  className="text-color"
                  style={{
                    paddingTop: "15px",
                    color: "#1560bd",
                    fontWeight: "",
                  }}
                >
                  Remark / Additional Information
                </label>
              </div>

              <div className="col-lg-5">
                <textarea
                  style={{
                    // paddingTop: "15px",
                    // paddingBottom: "15px",
                    backgroundColor: "#E8F0FE",
                    //color: "white",
                  }}
                  // onChange={(e) => setRemark(e.target.value)}
                  onChange={(e) => handleInputChangeNew(e, setRemark)}
                  value={remark}
                  className="form-control"
                  id="propertyDescription"
                  rows="4"
                  maxLength={200}
                ></textarea>
              </div>
            </div>
          </div>
          <div className="">
            <div className="row my_profile_setting_input form-group">
              <div className="col-lg-3">
                <label
                  className="text-color"
                  htmlFor=""
                  style={{
                    paddingTop: "20px",
                    color: "#1560bd",
                    fontWeight: "",
                  }}
                >
                  Attachment
                </label>
                <div className="hover-text-01">
                  <div
                    className="tooltip-text-01"
                    style={{ marginTop: "-95px", marginLeft: "-100px" }}
                  >
                    <ul>
                      <li>1. The attachment must be ≤ 25 MB.</li>
                      <li>
                        2. The attachment must be a ZIP file containing only the
                        following formats: .doc, .docx, .pdf, .xls, .xlsx, .ppt,
                        .pptx, .jpg, .jpeg, .png, .gif, .mp3, .mp4, .zip, .txt,
                        .csv.
                      </li>
                    </ul>
                  </div>
                  <i class="fa fa-info-circle" aria-hidden="true"></i>
                </div>
              </div>
              {attachment.length == 0 && (
                <div className="col-lg-2">
                  <label className="btn btn-color text-white mt-2">
                    Upload File
                    <input
                      type="file"
                      accept=".zip"
                      onChange={(e) => handleUpload(e)}
                      style={{ display: "none" }}
                      single
                    />
                  </label>
                </div>
              )}
              <div className="col-lg-7">
                <div className="my_profile_setting_input mt10 overflow-hidden text-center">
                  <div className="d-flex flex-wrap">
                    {attachment?.map((file, index) => {
                      return (
                        <div
                          key={index}
                          className="position-relative d-flex flex-column"
                        >
                          <div className="d-flex gap-1">
                            {attachment.length > 0 && (
                              <button
                                className="btn btn-success"
                                onClick={downloadAllAttachments}
                              >
                                {file.file.name}
                              </button>
                            )}
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={() => handleDelete(index)}
                            >
                              x
                            </button>
                          </div>
                          {/* <img
                            src={file.previewUrl}
                            alt="preview"
                            className="img-thumbnail"
                            style={{
                              width: "120px",
                              height: "120px",
                              objectFit: "cover",
                            }}
                          /> */}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-12">
            <div className="my_profile_setting_input overflow-hidden mt20 text-center">
              {!isDisable && (
                <button
                  disabled={disable}
                  className="btn btn5 m-1"
                  onClick={cancelHandler}
                >
                  Cancel
                </button>
              )}
              {!isDisable &&
                (propertyData ? (
                  <button
                    disabled={disable}
                    className={`btn btn5 ${isButtonDisabled ? "disabled" : ""}`}
                    onClick={submitHandler}
                  >
                    Update
                  </button>
                ) : (
                  <button
                    disabled={disable}
                    className="btn btn5"
                    onClick={submitHandler}
                  >
                    Submit
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailedInfo;
