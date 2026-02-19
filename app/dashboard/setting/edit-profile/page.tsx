"use client";
import DropDown from "@/component/DropDown";
import Input from "@/component/Input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, Upload } from "lucide-react";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Gender,
  getUser,
  updateUser,
  UpdateUserPayload,
} from "@/utils/userApi";

// ============================================
// Types
// ============================================

type EditProfileFormValues = {
  name: string;
  email: string;
  phoneNumber: string;
  gender: { text: string };
};

const genderOptions = [{ text: "Male" }, { text: "Female" }];

const toGenderOption = (gender: Gender | null) => {
  if (gender === "male") return { text: "Male" };
  if (gender === "female") return { text: "Female" };
  return { text: "Gender" };
};

const toGenderPayload = (text: string): Gender | undefined => {
  const map: Record<string, Gender> = {
    Male: "male",
    Female: "female",
  };
  return map[text];
};

// ============================================
// Page
// ============================================

const Page: NextPage = ({}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isGenderOpen, setIsGenderOpen] = useState(false);

  // ── Fetch user ──────────────────────────────
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  // ── Form ────────────────────────────────────
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<EditProfileFormValues>({
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      gender: { text: "Gender" },
    },
  });

  // Prefill inputs once user data arrives
  useEffect(() => {
    if (user) {
      reset({
        name: user.name ?? "",
        email: user.email ?? "",
        phoneNumber: user.phoneNumber ?? "",
        gender: toGenderOption(user.gender),
      });
    }
  }, [user, reset]);

  // ── Photo state ─────────────────────────────
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [hasPhotoChanged, setHasPhotoChanged] = useState(false);
  // previewUrl starts from server photo, updates instantly when user picks a new file
  const [previewUrl, setPreviewUrl] = useState<string>(
    user?.photo ?? "/default_user.jpg",
  );

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setHasPhotoChanged(true);
      // Create a local object URL so the new image shows immediately
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // ── Update mutation ──────────────────────────
  const {
    mutate: saveChanges,
    isPending,
    isError,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const onSubmit = (data: EditProfileFormValues) => {
    const payload: UpdateUserPayload = {
      name: data.name,
      phoneNumber: data.phoneNumber,
      gender: toGenderPayload(data.gender.text),
      ...(photoFile ? { photo: photoFile } : {}),
    };
    saveChanges(payload);
  };

  // ── Render ───────────────────────────────────
  return (
    <div className="w-full overflow-y-auto py-2xl px-xl flex flex-col bg-background-100 gap-xl">
      <div className="flex flex-row gap-md items-center">
        <button
          onClick={() => router.back()}
          className="size-[40px] rounded-lg bg-card-100 shadow-effect-2 flex justify-center items-center cursor-pointer hover:bg-card-200 active:bg-card-300 transition-all duration-200"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-nunitosans text-body font-bold">Edit Profile</h1>
      </div>

      {/* Photo section */}
      <div className="py-xl rounded-xl bg-card-100 shadow-effect-2 flex flex-col gap-md items-center">
        <div className="rounded-full bg-amber-600 size-[148px] object-cover relative">
          <Image
            src={previewUrl}
            alt="profile"
            quality={100}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={handlePhotoChange}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-row gap-md px-sm py-xs rounded-lg font-nunitosans text-body text-text-1000 items-center border bg-card-100 border-card-200 cursor-pointer hover:bg-card-200 active:bg-card-300"
        >
          <Upload size={18} />
          <p>Change Photo</p>
        </button>
        <p className="font-nunitosans text-body text-text-700">
          Supports JPG, PNG, up to 2MB.
        </p>
      </div>

      {/* Form section */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2xl p-xl bg-card-100 shadow-effect-2 rounded-xl font-nunitosans"
      >
        <h1 className="font-bold text-text-1000 text-body">Profile Info</h1>

        <div className="flex flex-col gap-lg">
          {/* Full Name */}
          <div className="flex flex-col gap-xs">
            <p className="text-text-1000 text-body">Full Name</p>
            <Input
              type="text"
              placeholder="Full Name"
              disabled={isLoading}
              {...register("name", { required: "Full name is required" })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Email — read only, cannot be changed */}
          <div className="flex flex-col gap-xs">
            <p className="text-text-1000 text-body">Email</p>
            <Input
              type="email"
              placeholder="example@gmail.com"
              disabled
              {...register("email")}
            />
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-xs">
            <p className="text-text-1000 text-body">Phone Number</p>
            <Input
              type="text"
              placeholder="98XXXXXXXX"
              disabled={isLoading}
              {...register("phoneNumber")}
            />
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-xs">
            <p className="text-text-1000 text-body">Gender</p>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <DropDown
                  options={genderOptions}
                  selectedOption={field.value}
                  isOpen={isGenderOpen}
                  onToggle={() => setIsGenderOpen((prev) => !prev)}
                  onSelect={(option) => {
                    field.onChange(option);
                    setIsGenderOpen(false);
                  }}
                />
              )}
            />
          </div>
        </div>

        {/* API feedback */}
        {isError && (
          <p className="text-red-600 text-sm">
            {(error as Error)?.message ??
              "Something went wrong. Please try again."}
          </p>
        )}
        {isSuccess && (
          <p className="text-green-600 text-sm">
            Profile updated successfully!
          </p>
        )}

        <div className="flex flex-row justify-end font-nunitosans text-body text-text-100 gap-md">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-xl py-xs rounded-lg bg-card-100 hover:bg-card-200 active:bg-card-300 cursor-pointer transition-all duration-200 border border-card-200 text-text-1000"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={(!isDirty && !hasPhotoChanged) || isPending}
            className={`px-xl py-xs rounded-lg ${
              (!isDirty && !hasPhotoChanged) || isPending
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-primary-600 active:bg-primary-700 cursor-pointer"
            } bg-primary-500 transition-all duration-200 text-text-100`}
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
