import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Navbar from "@/components/Navbar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { BACKEND_URL } from '@/config/config';
import { useAuth } from '@/Context/AuthContext';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function EditResponse() {

    const [applicationId, setApplicationId] = useState<string>("");
    const [sscPercentage, setSscPercentage] = useState<string>("");
    const [hscPercentage, setHscPercentage] = useState<string>("");
    const [jeePercentile, setJeePercentile] = useState<string>("");
    const [gujcetPercentile, setGujcetPercentile] = useState<string>("");
    const [idProof, setIdProof] = useState<File | null>(null);
    const [photo, setPhoto] = useState<File | null>(null);
    const [idProofUrl, setIdProofUrl] = useState<string>("");
    const [photoUrl, setPhotoUrl] = useState<string>("");

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
            applicationData.append("user_id", user?.user?.id || "");
            if (idProof) applicationData.append("id_proof", idProof);
            if (photo) applicationData.append("photo", photo);

            const response = await fetch(`${BACKEND_URL}/api/v1/application/updateApplication/${applicationId}`, {
                method: "PUT",
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

    const getApplication = async () => {
        const res = await fetch(`${BACKEND_URL}/api/v1/application/getApplication/${user?.user?.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        });

        if (res.ok) {
            const data = await res.json();
            setApplicationId(data.application._id);
            setSscPercentage(data.application.ssc_percentage);
            setHscPercentage(data.application.hsc_percentage);
            setJeePercentile(data.application.jee_percentile);
            setGujcetPercentile(data.application.gujcet_percentile);
            setPhotoUrl(data.application.photo);
            setIdProofUrl(data.application.id_proof);
        } else {
            console.log("Error in fetching data");
        }
    };

    useEffect(() => {
        getApplication();
    }, [user]);

    return (
        <>
            <div className="flex min-h-screen w-full flex-col bg-muted/40">
                <Navbar />
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8 m-12" style={{ padding: "1% 13%" }}>
                    <Card x-chunk="dashboard-07-chunk-0">
                        <CardHeader className="flex flex-col">
                            <p className="text-3xl font-bold"> Edit Response </p>
                            <CardDescription>
                                Change the below Application details and click on save to update the test.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col">
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
                                    {idProofUrl && (
                                        <div>
                                            <Button variant="link" onClick={() => window.location.href = BACKEND_URL+"/uploads/"+user?.user.id+"/"+idProofUrl} >
                                                View Uploaded ID Proof
                                            </Button>
                                        </div>
                                    )}
                                    <Input
                                        id="id-proof"
                                        name="id_proof"
                                        type="file"
                                        onChange={handleFileChange(setIdProof)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="photo">Photo</Label>
                                    {photoUrl && (
                                        <div>
                                            <img src={BACKEND_URL+"/uploads/"+user?.user.id+"/"+photoUrl} alt="Uploaded Photo" className="max-w-xs" />
                                        </div>
                                    )}
                                    <Input
                                        id="photo"
                                        name="photo"
                                        type="file"
                                        onChange={handleFileChange(setPhoto)}
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    Save Changes
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
