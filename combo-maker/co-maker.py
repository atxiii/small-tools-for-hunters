import argparse

def read_file(file_path):
    try:
        with open(file_path, 'r') as file:
            lines = file.read().splitlines()
        return lines
    except FileNotFoundError:
        print(f"Error: File '{file_path}' not found.")
        return []

def main():
    parser = argparse.ArgumentParser(description="Combine user and password lists from files.")
    parser.add_argument("-u", "--users-file", help="File containing the list of users")
    parser.add_argument("-p", "--passwords-file", help="File containing the list of passwords")

    args = parser.parse_args()

    users_file = args.users_file
    passwords_file = args.passwords_file

    users = read_file(users_file)
    passwords = read_file(passwords_file)

    if not users or not passwords:
        return

    users_repeated = [user for user in users for _ in range(3)]

    # Create combinations of users and passwords
    combinations = list(zip(users_repeated, passwords))

    # Print the combolist
    for user, password in combinations:
      print(f"{user}:{password}")


if __name__ == "__main__":
    main()

