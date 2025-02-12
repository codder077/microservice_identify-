import { Op } from "sequelize";
import Contact from "../models/Contact";

interface IdentifyRequest {
  email?: string;
  phoneNumber?: string;
}

interface IdentifyResponse {
  contact: {
    primaryContactId: number;
    emails: string[];
    phoneNumbers: string[];
    secondaryContactIds: number[];
  };
}

export class IdentifyService {
  async identify(data: IdentifyRequest): Promise<IdentifyResponse> {
    const { email, phoneNumber } = data;

    // Find existing contacts matching the email or phoneNumber
    const whereClause = [];
    if (email) whereClause.push({ email });
    if (phoneNumber) whereClause.push({ phoneNumber });

    const existingContacts =
      whereClause.length > 0
        ? await Contact.findAll({
            where: { [Op.or]: whereClause },
          })
        : [];

    if (existingContacts.length === 0) {
      // Create new primary contact
      const newContact = await Contact.create({
        email,
        phoneNumber,
        linkPrecedence: "primary",
      });

      return {
        contact: {
          primaryContactId: newContact.id,
          emails: email ? [email] : [],
          phoneNumbers: phoneNumber ? [phoneNumber] : [],
          secondaryContactIds: [],
        },
      };
    }

    // Find all primary contacts in the existing contacts
    const primaryContacts = existingContacts.filter(
      (c) => c.linkPrecedence === "primary"
    );

    let primaryContact: Contact | null | undefined = primaryContacts[0];

    if (primaryContacts.length > 1) {
      primaryContacts.sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
      );
      primaryContact = primaryContacts[0];

      // Collect IDs of primaries being converted to secondary
      const secondaryPrimaryIds = primaryContacts.slice(1).map((c) => c.id);

      for (const contact of primaryContacts.slice(1)) {
        await contact.update({
          linkedId: primaryContact?.id,
          linkPrecedence: "secondary",
        });
      }

      // Re-link secondaries of the now-secondary primaries
      if (secondaryPrimaryIds.length > 0) {
        await Contact.update(
          { linkedId: primaryContact?.id }, // Set linkedId to the new primary
          {
            where: {
              linkedId: { [Op.in]: secondaryPrimaryIds }, // Find secondaries linked to old primaries
              linkPrecedence: "secondary", // Ensure we are only updating secondaries
            },
          }
        );
      }
    } else if (primaryContacts.length === 0 && existingContacts.length > 0) {
      const firstSecondaryContact = existingContacts[0];
      if (firstSecondaryContact.linkedId) {
        const linkedPrimaryId = firstSecondaryContact.linkedId;
        primaryContact = await Contact.findByPk(linkedPrimaryId);

        if (!primaryContact) {
          console.error(
            "Error: Linked primary contact not found for secondary contact:",
            firstSecondaryContact
          );
          throw new Error("Linked primary contact not found.");
        }
      }
    }

    if (!primaryContact) {
      console.error(
        "Error: Could not determine primary contact even with existing contacts:",
        existingContacts
      );
      throw new Error("Could not determine primary contact.");
    }

    const allLinkedContacts = await this.fetchAllLinkedContacts(
      primaryContact.id
    );

    const hasNewEmail =
      email && !allLinkedContacts.some((c) => c.email === email);
    const hasNewPhone =
      phoneNumber &&
      !allLinkedContacts.some((c) => c.phoneNumber === phoneNumber);

    if (hasNewEmail || hasNewPhone) {
      const newSecondary = await Contact.create({
        email,
        phoneNumber,
        linkedId: primaryContact.id,
        linkPrecedence: "secondary",
      });
      allLinkedContacts.push(newSecondary);
    }

    const emails = [
      ...new Set(
        allLinkedContacts
          .map((c) => c.email)
          .filter((email): email is string => email !== null)
      ),
    ];
    const phoneNumbers = [
      ...new Set(
        allLinkedContacts
          .map((c) => c.phoneNumber)
          .filter((phone): phone is string => phone !== null)
      ),
    ];

    if (primaryContact.email && emails.includes(primaryContact.email)) {
      emails.splice(emails.indexOf(primaryContact.email), 1);
      emails.unshift(primaryContact.email);
    }
    if (
      primaryContact.phoneNumber &&
      phoneNumbers.includes(primaryContact.phoneNumber)
    ) {
      phoneNumbers.splice(phoneNumbers.indexOf(primaryContact.phoneNumber), 1);
      phoneNumbers.unshift(primaryContact.phoneNumber);
    }

    const secondaryContactIds = allLinkedContacts
      .filter((c) => c.linkPrecedence === "secondary")
      .map((c) => c.id);

    return {
      contact: {
        primaryContactId: primaryContact.id,
        emails,
        phoneNumbers,
        secondaryContactIds,
      },
    };
  }

  private async fetchAllLinkedContacts(primaryId: number): Promise<Contact[]> {
    const allContacts: Contact[] = [];
    const queue = [primaryId];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const contacts = await Contact.findAll({
        where: { [Op.or]: [{ id: currentId }, { linkedId: currentId }] },
      });

      for (const contact of contacts) {
        if (!allContacts.some((c) => c.id === contact.id)) {
          allContacts.push(contact);
          if (contact.linkPrecedence === "primary") {
            queue.push(contact.id);
          }
        }
      }
    }
    return allContacts;
  }
}
