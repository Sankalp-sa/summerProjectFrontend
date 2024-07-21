import { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { BACKEND_URL } from "@/config/config";
import { useAuth } from "@/Context/AuthContext";

export default function Application() {
  const [sscPercentage, setSscPercentage] = useState<string>("");
  const [hscPercentage, setHscPercentage] = useState<string>("");
  const [jeePercentile, setJeePercentile] = useState<string>("");
  const [gujcetPercentile, setGujcetPercentile] = useState<string>("");
  const [idProof, setIdProof] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);

  const { user } = useAuth();

  const handleFileChange = (setFile: React.Dispatch<React.SetStateAction<File | null>>) => (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFile(file);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {

      const applicationData = new FormData();
      applicationData.append("ssc_percentage", sscPercentage);
      applicationData.append("hsc_percentage", hscPercentage);
      applicationData.append("jee_percentile", jeePercentile);
      applicationData.append("gujcet_percentile", gujcetPercentile);
      applicationData.append("user_id", user.user?.id || "")
      if (idProof) applicationData.append("id_proof", idProof);
      if (photo) applicationData.append("photo", photo);

      console.log(applicationData)

      const response = await fetch(`${BACKEND_URL}/api/v1/application/send`, {
        method: "POST",
        body: applicationData,
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      console.log(result);
      // Handle the response accordingly
    } catch (error) {
      console.error("Error:", error);
      // Handle the error accordingly
    }
  };

  return (
    <>
      <Navbar />
      <Card className="mx-auto max-w-screen-md my-10">
        <CardHeader>
          <CardTitle className="text-xl">Application Form</CardTitle>
          <CardDescription>
            Enter your information to send application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="ssc-percentage">SSC Percentage</Label>
              <Input
                id="ssc-percentage"
                name="ssc_percentage"
                type="number"
                placeholder="SSC Percentage"
                value={sscPercentage}
                onChange={(e) => setSscPercentage(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hsc-percentage">HSC Percentage</Label>
              <Input
                id="hsc-percentage"
                name="hsc_percentage"
                type="number"
                placeholder="HSC Percentage"
                value={hscPercentage}
                onChange={(e) => setHscPercentage(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="jee-percentile">JEE Percentile</Label>
              <Input
                id="jee-percentile"
                name="jee_percentile"
                type="number"
                placeholder="JEE Percentile"
                value={jeePercentile}
                onChange={(e) => setJeePercentile(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gujcet-percentile">GUJCET Percentile</Label>
              <Input
                id="gujcet-percentile"
                name="gujcet_percentile"
                type="number"
                placeholder="GUJCET Percentile"
                value={gujcetPercentile}
                onChange={(e) => setGujcetPercentile(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="id-proof">ID Proof</Label>
              <Input
                id="id-proof"
                name="id_proof"
                type="file"
                onChange={handleFileChange(setIdProof)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="photo">Photo</Label>
              <Input
                id="photo"
                name="photo"
                type="file"
                onChange={handleFileChange(setPhoto)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Submit Application
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
