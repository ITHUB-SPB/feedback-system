import path from "node:path";
import { readFile } from "node:fs/promises";
import { fakerRU as faker } from "@faker-js/faker";

type PersonIn = {
  first_name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  phone?: string;
};

type FeedbackTypeIn =
  | {
    feedback_type_id: number;
    topic_category_topic_id?: null;
  }
  | {
    feedback_type_id: number;
    topic_category_topic_id: number;
    files: Blob[];
  };

type FeedbackIn = PersonIn &
  FeedbackTypeIn & { project_id: number } & { description: string };

function generatePerson(): PersonIn {
  const sex = faker.person.sexType();
  const first_name = faker.person.firstName(sex);
  const last_name = faker.person.lastName(sex);

  return {
    first_name,
    last_name,
    middle_name: faker.person.middleName(sex),
    email: faker.internet.email({ firstName: first_name, lastName: last_name }),
    phone: faker.phone.number({ style: "international" }),
  };
}

function generateProjectId(): { project_id: number } {
  const project_ids = {
    priozersk: [198, 331, 337],
    vyborg: [37, 469, 470, 497],
    schlisselburg: [447, 574, 590],
  };

  return {
    project_id: faker.helpers.arrayElement(Object.values(project_ids).flat()),
  };
}

async function generateFeedback(): Promise<FeedbackIn> {
  const TYPE_WISH = 1;
  const TYPE_ISSUE = 2;
  const TYPE_VARIANTS = [TYPE_ISSUE, TYPE_WISH];
  const TCT_VARIANTS = [52, 13, 24, 28, 41, 49];

  const feedback_type_id = faker.helpers.arrayElement(TYPE_VARIANTS);

  const baseFields = {
    ...generatePerson(),
    ...generateProjectId(),
    description: faker.lorem.sentences({ min: 2, max: 12 }),
  };

  if (feedback_type_id === TYPE_WISH) {
    return { ...baseFields, feedback_type_id };
  }

  return {
    feedback_type_id,
    topic_category_topic_id: faker.helpers.arrayElement(TCT_VARIANTS),
    ...baseFields,
    ...(await generateFiles()),
  };
}

async function generateFiles(): Promise<{ files: Blob[] }> {
  const images = [
    "image-1.png",
    "image-2.png",
    "image-3.png",
    "image-4.png",
    "image-5.jpg",
    "image-6.jpg",
  ];
  const imagesNumber = faker.number.int({ min: 1, max: 5 });

  const filePromises: Promise<Buffer>[] = [];
  const fileNames: string[] = [];
  const mimeTypes: string[] = [];

  for (let ix = 0; ix < imagesNumber; ix++) {
    const imageName = faker.helpers.arrayElement(images);
    const imageUrl = path.resolve(import.meta.dirname, "./", imageName);
    fileNames.push(imageName);
    mimeTypes.push(`image/${imageName.split(".").at(-1)}`);
    filePromises.push(readFile(imageUrl));
  }

  return {
    files: await Promise.all(filePromises).then((buffers) =>
      buffers.map((buffer, index) => {
        return new File([buffer], fileNames[index]!, {
          type: mimeTypes[index],
        });
      }),
    ),
  };
}

export default async function seedFeedback() {
  for (let i = 0; i < 40; i++) {
    const feedbackRecord = await generateFeedback();
    const form = new FormData();
    for (const field in feedbackRecord) {
      if (field === "files" && "files" in feedbackRecord) {
        for (const file of feedbackRecord.files) {
          form.append("files", file);
        }
        continue;
      }
      form.append(field, feedbackRecord[field as keyof typeof feedbackRecord]);
    }

    await fetch("http://localhost:3001/api/feedback", {
      method: "POST",
      body: form,
    });
  }
}
